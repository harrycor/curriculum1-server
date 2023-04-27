import { Router } from "express";
import config from "../config";
import db from "../db";
import tenants from "../db/tenants";
import { verify } from "jsonwebtoken";

const router = Router();

const fetch = require("node-fetch");

// wz spi list https://api.wrestlingrating.com/swagger/index.html

export const getWarZoneAdminAuthToken = async () => {
  const reqOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      // "Abp.TenantId": "1", //This will likely be necessary in the future. It specifies the tenant we connect to. For some reason it is not currently needed for the primary Warzone tenant, but it likely will become necessary.
    },
    body: JSON.stringify({
      userNameOrEmailAddress: config.warZone.adminUserNameOrEmail,
      // tenancyName: Warzone //This probably belongs here, but magically works without it for some reason on production
      password: config.warZone.adminPassword,
      rememberClient: config.warZone.adminRememberClient,
    }),
  };
  return fetch(
    // `${process.env.WARZONE_URL}/api/TokenAuth/Authenticate`,
    `https://api.wrestlingtournaments.com/api/TokenAuth/Authenticate`,
    // "https://api.wrestlingrating.com/api/TokenAuth/Authenticate",
    reqOptions
  )
    .then((data: any) => data.json())
    .then((data: any) => data.result.accessToken)
    .catch((err: Error) => console.log(err));
};

// localhost:3000/api/warZone/getAllWrestlers
router.post("/getAllWrestlers", async (req: any, res: any) => {
  type arrayOfWrestlersType = { id: number; name: string }[];

  function filterWrestlers(
    filter: string,
    wreslters: arrayOfWrestlersType
  ): arrayOfWrestlersType {
    let filteredWrestlers = wreslters.filter((wrestler) =>
      wrestler.name.toLowerCase().includes(filter.toLowerCase())
    );
    return filteredWrestlers;
  }

  try {
    let wzAccessToken: string = await getWarZoneAdminAuthToken();
    let searchParam: string = req.body.searchParam;

    if (searchParam.length >= 3) {
      // if (searchParam) {
      await fetch(
        // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetAll",
        // `${process.env.WARZONE_URL}/api/services/app/Wrestler/GetAllWrestlersList`,
        `https://api.wrestlingtournaments.com/api/services/app/Wrestler/GetAllWrestlersList`,
        // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetAllWrestlersList",
        // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetWrestlerDetailsById?WrestlerId=",
        // "https://api.wrestlingrating.com/api/services/app/Wrestler/Get?Id=",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${wzAccessToken}`,
          },
        }
      )
        .then((data: any) => {
          return data.json();
        })
        .then((data: { result: arrayOfWrestlersType }) => {
          let wreslters = data.result;

          let finalWreslersArray = filterWrestlers(searchParam, wreslters);
          return finalWreslersArray;
        })
        .then((data: arrayOfWrestlersType) => res.status(200).json(data));
    } else {
      res.status(200).json({ message: "More letters!" });
    }
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const getWrestlerInfoFromWarZone = async (
  curriculumUser: CurriculumUserInterface,
  wzAccessToken: string
) => {
  delete curriculumUser.password;

  if (!curriculumUser.war_zone_id) {
    return curriculumUser;
  }
  return await fetch(
    // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetAll",
    // `${process.env.WARZONE_URL}/api/services/app/Wrestler/GetWrestlerDetailsById?WrestlerId=${curriculumUser.war_zone_id}`,
    `https://api.wrestlingtournaments.com/api/services/app/Wrestler/GetWrestlerDetailsById?WrestlerId=${curriculumUser.war_zone_id}`,
    //     // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetAllWrestlersList",
    // "https://api.wrestlingrating.com/api/services/app/Wrestler/GetWrestlerDetailsById?WrestlerId=",
    // "https://api.wrestlingrating.com/api/services/app/Wrestler/Get?Id=",
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${wzAccessToken}`,
      },
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .then((data: WarZoneUserResponse) => {
      curriculumUser.WAR = data.result.weightAdjustedRating;
      curriculumUser.age = data.result.age;
      curriculumUser.weight = data.result.weight;
      curriculumUser.lastWeighInDate = data.result.lastWeighInDate;
      // const finalUser: FinalUserInterface = {
      //   ...curriculumUser,
      //   WAR: data.result.weightAdjustedRating,
      //   weight: data.result.weight,
      //   age: data.result.age,
      // };

      return curriculumUser;
    })
    .catch((err: any) => {
      console.log(err);
      return curriculumUser;
    });
};
// localhost:3000/api/warZone/initialGetAllWrestlers
router.post("/initialGetAllWrestlers", async (req: any, res: any) => {
  const UID = req.body.UID;
  console.log("get em");

  try {
    // Just call the same thing that this fetch is moron... you are already in the back end
    // here you are God

    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let tenantId = tokenVerify.tenant;

    // let users = await db.personal_info.allPeopleRelevantToUser(UID);
    let users = await db.users.getAllUsersInTenantFromTenantID(tenantId);

    let wzAccessToken: string = await getWarZoneAdminAuthToken();
    //add all of the WAR Zone information.

    for (let x = 0; x < users.length; x++) {
      let wrestlerWithWAR = await getWrestlerInfoFromWarZone(
        users[x],
        wzAccessToken
      );
      // whoever did this error message :( --WayneCarl
      // console.log("Another damn ahhhhhhh");
      if (users[x] == null) {
        console.log("Here is a user without a WAR");
        continue;
      }
      if (wrestlerWithWAR == null) {
        console.log("Here is another user without a WAR");
        console.log(users[x]);
        continue;
      }
      users[x] = wrestlerWithWAR;
    }

    res.status(200).json(users);
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
});

export default router;

interface CurriculumUserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role?: string;
  real_email?: string;
  phone_number?: string;
  war_zone_id?: number;
  date_created?: Date;
  tenant?: number;
  WAR?: number;
  age?: number;
  weight?: number;
  lastWeighInDate: Date;
}

interface WarZoneUserInterface {
  id: number;
  dateDif?: any;
  firstName: string;
  weight: number;
  unOfficialWeight: number;
  rating: number;
  weightAdjustedRating: number;
  age: number;
  player1Id: number;
  player2Id: number;
  isWrestlerWeighIn: boolean;
  isExistsInPool: boolean;
  teamName?: any;
  eventName?: any;
  lastWeighInDate: Date;
  eventId: number;
  lastWeighInWeight: number;
  photo?: any;
  matchesHistory?: any;
  isInPairing: boolean;
  creationTime: Date;
  userId: number;
  userName?: any;
  numberOfMatchCount: number;
  pairingDate: Date;
}

interface WarZoneUserResponse {
  result: WarZoneUserInterface;
  targetUrl?: any;
  success: boolean;
  error?: any;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}
