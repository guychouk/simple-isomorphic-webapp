import _ from "lodash";
import faker from "faker";

import { getRandomDate } from "./date";
import { Promotion } from "../types/promotion";

export function generatePromotion(): Promotion {
  return {
    name: faker.name.findName(),
    type: _.sample(["Basic", "Common", "Epic"]) as Promotion["type"],
    startDate: getRandomDate(new Date("01/01/1970"), new Date("01/01/2000")),
    endDate: getRandomDate(new Date("01/01/2001"), new Date()),
    userGroupName: faker.name.findName(),
  };
}
