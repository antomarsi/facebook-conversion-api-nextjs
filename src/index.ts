import { v4 as uuidv4 } from "uuid";
import FBEventType from "../types";
import debug from "./utils/debug";

declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Trigger Facebook PageView Event (Standard Pixel).
 *
 * @constructor
 */
const fbPageView = (): void => {
  debug("Client Side Event: PageView");

  window.fbq("track", "PageView");
};

/**
 * Trigger custom Facebook Event (Conversion API and optionally Standard Pixel).
 *
 * @param event
 * @constructor
 */
const fbEvent = (event: FBEventType): Promise<void> => {
  const eventId = event.eventId ? event.eventId : uuidv4();
  const eventTracker = event.eventTracker ? event.eventTracker : "track";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (event.enableStandardPixel) {
        if (event.ignoreProduct) {
          window.fbq(eventTracker, event.eventName);
        } else {
          window.fbq(
            eventTracker,
            event.eventName,
            {
              content_type: "product",
              contents: event.products?.map((product) => ({
                id: product.sku,
                quantity: product.quantity,
              })),
              value: event.value,
              currency: event.currency,
            },
            { eventID: eventId }
          );
        }

        debug(`Client Side Event: ${event.eventName}`);
      }

      fetch("/api/fb-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: event.eventName,
          eventId,
          emails: event.emails,
          phones: event.phones,
          products: event.products,
          value: event.value,
          currency: event.currency,
        }),
      })
        .then((response) => {
          resolve();
          debug(`Server Side Event: ${event.eventName} (${response.status})`);
        })
        .catch((error) => {
          reject();
          debug(`Server Side Event: ${event.eventName} (${error.status})`);
        });
    }, 250);
  });
};

export { fbEvent, fbPageView };
