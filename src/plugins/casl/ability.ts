import { createMongoAbility } from '@casl/ability'
import type { actions, subjects } from '@/configs/abilityConfig'

type Actions = typeof actions[number]
type Subjects = typeof subjects[number]

export interface Rule { action: Actions; subject: Subjects }

export const ability = createMongoAbility<[Actions, Subjects]>()
