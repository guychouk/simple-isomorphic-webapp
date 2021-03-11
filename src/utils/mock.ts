import _ from "lodash";
import faker from "faker";

import { getRandomDate } from "./date";
import { User } from "../types/user";

export function generateUser(): User {
  return {
    name: faker.name.findName(),
    type: _.sample(["Basic", "Common", "Epic"]) as User["type"],
    startDate: getRandomDate(new Date("01/01/1970"), new Date("01/01/2000")),
    endDate: getRandomDate(new Date("01/01/2001"), new Date()),
    userGroupName: faker.name.findName(),
  };
}
