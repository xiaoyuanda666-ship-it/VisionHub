import path from "path"

export async function activate_skill(args, { skillManager, agent }) {

  const { name } = args || {}

  if (!name) {
    return { success:false, error:"skill name empty" }
  }

  const skill = skillManager.activateSkill(name)

  if (!skill) {
    return { success:false, error:`Skill not found: ${name}` }
  }

  const content = skillManager.activateSkill(name)

  const skillPath = skill.path
  const baseDir = skill.baseDir

  agent.activeSkill = {
    name,
    path:skillPath,
    baseDir
  }

  return {
    success:true,
    content:`
<skill_content name="${name}">
${content}

Skill directory: ${baseDir}
Relative paths should be resolved from this directory.
</skill_content>
`
  }

}