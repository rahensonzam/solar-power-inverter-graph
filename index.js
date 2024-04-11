
const baseUrl = "http://api.shinemonitor.com/public/";

async function main() {

    const paramValues = getParamValues();

    const usr = paramValues.usr;
    const password = paramValues.password;
    const salt = new Date().getTime();
    console.log("salt", salt);
    const companyKey = paramValues.companyKey;
    const source = paramValues.source;
    const appClient = paramValues.appClient;
    const appId = paramValues.appId;
    const appVersion = paramValues.appVersion;
    const shaOfPassword = await sha1(password);
    console.log("shaOfPassword", shaOfPassword);
    const sign = await sha1(`${salt}${shaOfPassword}&action=auth&usr=${usr}&company-key=${companyKey}`);
    console.log("sign", sign);

    const authReqUrl = `${baseUrl}?sign=${sign}&salt=${salt}&action=auth&usr=${usr}&company-key=${companyKey}&source=${source}&_app_client_=${appClient}&_app_id_=${appId}&_app_version_=${appVersion}`;
    console.log("authReqUrl", authReqUrl);

    console.log(await makeGetRequest(authReqUrl));

}

async function sha1(str) {
    const enc = new TextEncoder().encode(str); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-1", enc); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

// await sha1('hello, world!');
// outputs: 1f9d3c707d53f3d16c53dd73d70a6ce7596a9 

function makeGetRequest(url) {
    const options = {
        method: "GET",
    };
    return makeWebRequest(url, options);
}

async function makeWebRequest(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error. status: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Unexpected token < in JSON
            console.error("Check for HTML being returned instead of expected JSON", error);
        } else {
            console.error(error);
        }
    }
}

main();