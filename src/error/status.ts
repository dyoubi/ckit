export type ServerCode =
	| 100 | 101 | 102 | 103
	| 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
	| 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308
	| 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409
	| 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417
	| 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429
	| 431
	| 451
	| 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

export type ServerStatusCode = `${ServerCode}`;

export enum EServerStatusCode {
	"Continue" = "100",
	"SwitchingProtocols" = "101",
	"Processing" = "102",
	"EarlyHints" = "103",
	"OK" = "200",
	"Created" = "201",
	"Accepted" = "202",
	"NonUthoritativeInformation" = "203",
	"NoContent" = "204",
	"ResetContent" = "205",
	"PartialContent" = "206",
	"MultiStatus" = "207",
	"AlreadyReported" = "208",
	"IMUsed" = "226",
	"MultipleChoices" = "300",
	"MovedPermanently" = "301",
	"Found" = "302",
	"SeeOther" = "303",
	"NotModified" = "304",
	"UseProxy" = "305",
	"TemporaryRedirect" = "307",
	"PermanentRedirect" = "308",
	"BadRequest" = "400",
	"Unauthorized" = "401",
	"PaymentRequired" = "402",
	"Forbidden" = "403",
	"NotFound" = "404",
	"MethodNotAllowed" = "405",
	"NotAcceptable" = "406",
	"ProxyAuthenticationRequired" = "407",
	"RequestTimeout" = "408",
	"Conflict" = "409",
	"Gone" = "410",
	"LengthRequired" = "411",
	"PreconditionFailed" = "412",
	"PayloadTooLarge" = "413",
	"URITooLong" = "414",
	"UnsupportedMediaType" = "415",
	"RangeNotSatisfiable" = "416",
	"ExpectationFailed" = "417",
	"MisdirectedRequest" = "421",
	"UnprocessableEntity" = "422",
	"Locked" = "423",
	"FailedDependency" = "424",
	"TooEarly" = "425",
	"UpgradeRequired" = "426",
	"PreconditionRequired" = "428",
	"TooManyRequests" = "429",
	"RequestHeaderFieldsTooLarge" = "431",
	"UnavailableForLegalReasons" = "451",
	"InternalServerError" = "500",
	"NotImplemented" = "501",
	"BadGateway" = "502",
	"ServiceUnavailable" = "503",
	"GatewayTimeout" = "504",
	"HTTPVersionNotSupported" = "505",
	"VariantAlsoNegotiates" = "506",
	"InsufficientStorage" = "507",
	"LoopDetected" = "508",
	"NotExtended" = "510",
	"NetworkAuthenticationRequired" = "511",
}

export type ServerErrorStatus =
	| "BadRequest"
	| "Unauthorized"
	| "PaymentRequired"
	| "Forbidden"
	| "NotFound"
	| "MethodNotAllowed"
	| "NotAcceptable"
	| "ProxyAuthenticationRequired"
	| "RequestTimeout"
	| "Conflict"
	| "Gone"
	| "LengthRequired"
	| "PreconditionFailed"
	| "PayloadTooLarge"
	| "URITooLong"
	| "UnsupportedMediaType"
	| "RangeNotSatisfiable"
	| "ExpectationFailed"
	| "MisdirectedRequest"
	| "UnprocessableEntity"
	| "Locked"
	| "FailedDependency"
	| "TooEarly"
	| "UpgradeRequired"
	| "PreconditionRequired"
	| "TooManyRequests"
	| "RequestHeaderFieldsTooLarge"
	| "UnavailableForLegalReasons"
	| "InternalServerError"
	| "NotImplemented"
	| "BadGateway"
	| "ServiceUnavailable"
	| "GatewayTimeout"
	| "HTTPVersionNotSupported"
	| "VariantAlsoNegotiates"
	| "InsufficientStorage"
	| "LoopDetected"
	| "NotExtended"
	| "NetworkAuthenticationRequired";

export type ServerStatus =
	| "Continue"
	| "SwitchingProtocols"
	| "Processing"
	| "EarlyHints"
	| "OK"
	| "Created"
	| "Accepted"
	| "Non-uthoritativeInformation"
	| "NoContent"
	| "ResetContent"
	| "PartialContent"
	| "Multi-tatus"
	| "AlreadyReported"
	| "IMUsed"
	| "MultipleChoices"
	| "MovedPermanently"
	| "Found"
	| "SeeOther"
	| "NotModified"
	| "UseProxy"
	| "TemporaryRedirect"
	| "PermanentRedirect" & ServerErrorStatus;

