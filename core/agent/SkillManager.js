import fs from "fs"
import path from "path"
import matter from "gray-matter"

export class SkillManager {

  constructor(skillDirs){
    if(typeof skillDirs === "string"){
      skillDirs = [skillDirs]
    }

    this.skillDirs = skillDirs
    this.skills = new Map()
  }

  loadSkills(){
  for(const dir of this.skillDirs){
    console.log("Scanning dir:", dir)
    const folders = fs.readdirSync(dir)
    console.log("Found folders:", folders)
    for(const folder of folders){
      const skillPath = path.join(dir, folder, "SKILL.md")
      console.log("Checking skillPath:", skillPath, "exists?", fs.existsSync(skillPath))
      if(!fs.existsSync(skillPath)) continue

      const file = fs.readFileSync(skillPath,"utf8")
      const {data} = matter(file)
      console.log("Parsed frontmatter:", data)

      if(!data.name){
        console.warn("Missing name, skipping:", skillPath)
        continue
      }

      if(this.skills.has(data.name)){
        console.warn("Duplicate skill name:", data.name)
      }

      this.skills.set(data.name,{
        name:data.name,
        description:data.description,
        path:skillPath,
        baseDir:path.join(dir,folder)
      })
    }
  }
  console.log("Loaded skills:", [...this.skills.keys()])
}

  getCatalog(){
    console.log("skills loaded:", this.skills.size)
    return [...this.skills.values()].map(skill=>({
      name:skill.name,
      description:skill.description,
      location:skill.path
    }))

  }

  activateSkill(name){
    const skill = this.skills.get(name)
    if(!skill) return null
    return fs.readFileSync(skill.path,"utf8")
  }

}