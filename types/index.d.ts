type FBEventType = {
  eventTracker?: string
  eventName: string
  eventId?: string
  emails?: Array<string> | null
  phones?: Array<string> | null
  products?: {
    sku: string
    quantity: number
  }[]
  value?: number
  currency?: string
  enableStandardPixel?: boolean
  ignoreProduct?: boolean
};

export default FBEventType;
