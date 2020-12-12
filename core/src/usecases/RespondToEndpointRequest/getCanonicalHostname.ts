// StaticDeploy considers canonical hostnames NOT ending with a dot. If a final
// dot is present, this function removes it
export default function getCanonicalHostname(hostname: string): string {
    return hostname.replace(/\.$/, "");
}
