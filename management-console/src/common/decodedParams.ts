import mapValues from "lodash/mapValues";
import { match as Match } from "react-router";

export default function decodedParams<
    Params extends { [K in keyof Params]?: string }
>(match: Match<Params>): Params {
    return mapValues(match.params, (param: string | undefined) =>
        param ? decodeURIComponent(param) : param
    ) as Params;
}
