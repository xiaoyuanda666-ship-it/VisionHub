const ACL = {
  system: ["create:notice"],
  weather: ["create:weather"],
  assistant: ["create:webpage"]
}

export function checkPermission(cmd) {
  const key = cmd.action + ":" + cmd.type
  return ACL[cmd.agent]?.includes(key)
}