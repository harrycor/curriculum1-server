type possibleMessages =
  | "success"
  | "created"
  | "accepted, but can't wait for it to finish"
  | "no content"
  | "refresh the page"
  | "content not modified"
  | "bad request"
  | "unauthorized / not logged in"
  | "forbidden"
  | "not found"
  | "method not allowed"
  | "unsuported media type"
  | "the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503."
  | "the syntax of the request entity is correct, but was unable to be processed"
  | "internal server error"
  | "service unavailable"
  | "unkown server error";

export default class ResponseErrorHandlingAndParsing {
  private res: any;
  public json: any;
  constructor(res: any) {
    this.res = res;
    this.json = ResponseErrorHandlingAndParsing.returnJsonifiedResponse(res);
  }

  private static async returnJsonifiedResponse(ress: any) {
    try {
      let json = await ress.json();
      return json;
    } catch (err) {
      return Error("Unable to parse json");
    }
  }

  public static returnStringifiedObject(
    ress: Record<string | number, any> | Array<any>
  ): string {
    return JSON.stringify(ress);
  }

  // The 1xx status codes – informational requests
  // The 2xx status codes – successful requests
  // The 3xx status codes – redirects
  // The 4xx status codes – client errors
  // The 5xx status codes – server errors

  private returnStatusAsString(): possibleMessages {
    switch (this.res.status) {
      case 200:
        return "success";
      case 201:
        return "created";
      case 202:
        return "accepted, but can't wait for it to finish";
      case 204:
        return "no content";
      case 205:
        return "refresh the page";
      case 304:
        return "content not modified";
      case 400:
        return "bad request";
      case 401:
        return "unauthorized / not logged in";
      case 403:
        return "forbidden";
      case 404:
        return "not found";
      case 405:
        return "method not allowed";
      case 415:
        return "unsuported media type";
      case 418:
        return "the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503.";
      case 422:
        return "the syntax of the request entity is correct, but was unable to be processed";
      case 500:
        return "internal server error";
      case 503:
        return "service unavailable";

      default:
        return "unkown server error";
    }
  }

  public ifErrorStatusReturnError(): Error | void {
    if (this.res.status > 399 && this.res.message) {
      return new Error(this.res.message);
    } else if (this.res.status > 399) {
      return new Error(this.returnStatusAsString());
    } else {
    }
  }

  public returnMessage():
    | possibleMessages
    | "this res had no status on it or message" {
    if (
      !!this.json &&
      typeof this.json === "object" &&
      "message" in this.json &&
      // @ts-ignore
      typeof this.json.message === "string"
    ) {
      // @ts-ignore
      return this.json.message;
    } else if (this.res.status) {
      return this.returnStatusAsString();
    } else {
      return "this res had no status on it or message";
    }
  }
}
