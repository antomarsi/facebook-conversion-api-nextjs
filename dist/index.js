"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fbPageView = exports.fbEvent = void 0;
const uuid_1 = require("uuid");
const debug_1 = __importDefault(require("./utils/debug"));
/**
 * Trigger Facebook PageView Event (Standard Pixel).
 *
 * @constructor
 */
const fbPageView = () => {
    (0, debug_1.default)("Client Side Event: PageView");
    window.fbq("track", "PageView");
};
exports.fbPageView = fbPageView;
/**
 * Trigger custom Facebook Event (Conversion API and optionally Standard Pixel).
 *
 * @param event
 * @constructor
 */
const fbEvent = (event) => {
    const eventId = event.eventId ? event.eventId : (0, uuid_1.v4)();
    const eventTracker = event.eventTracker ? event.eventTracker : "track";
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var _a;
            if (event.enableStandardPixel) {
                if (event.ignoreProduct) {
                    window.fbq(eventTracker, event.eventName);
                }
                else {
                    window.fbq(eventTracker, event.eventName, {
                        content_type: "product",
                        contents: (_a = event.products) === null || _a === void 0 ? void 0 : _a.map((product) => ({
                            id: product.sku,
                            quantity: product.quantity,
                        })),
                        value: event.value,
                        currency: event.currency,
                    }, { eventID: eventId });
                }
                (0, debug_1.default)(`Client Side Event: ${event.eventName}`);
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
                (0, debug_1.default)(`Server Side Event: ${event.eventName} (${response.status})`);
            })
                .catch((error) => {
                reject();
                (0, debug_1.default)(`Server Side Event: ${event.eventName} (${error.status})`);
            });
        }, 250);
    });
};
exports.fbEvent = fbEvent;
