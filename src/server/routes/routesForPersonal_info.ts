import { Router } from "express";
import db from "../db";
import { hasValidAdminToken, hasValidToken } from "../utils/tokenCheck";

const router = Router();
// router.use("/personal_info", hasValidToken, routesForPersonal_info);

router.get("/:id?", async (req, res) => {
  let UID = Number(req.params.id);
  res.json(await db.personal_info.allPeopleRelevantToUser(UID));
});

router.get("/person/:id?", async (req, res) => {
  let id = Number(req.params.id);
  try {
    if (id) {
      res.json(await db.personal_info.singlePerson(id));
    }
  } catch (e) {
    console.log("Error in /person/:id? route");
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  try {
    res.json(await db.personal_info.createPerson(req.body));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/updatecurrentitem", async (req, res) => {
  let UID = Number(req.body.UID);
  let itemId = Number(req.body.itemId);

  try {
    const data: any = await db.personal_info.updatePersonsCurrentItem(
      UID,
      itemId
    );

    if (data.changedRows == 1) {
      res.sendStatus(200);
    } else if (data.changedRows > 1) {
      throw "You have some how updated more than one db row please make a note of the wrestlers name and notify Coach Jason or WayneCarl";
    } else {
      throw "Wrestlers shirt was not updated please contact Jason or WayneCarl";
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.put("/updateFirstName", hasValidAdminToken, async (req, res) => {
  let userId = req.body.userId;
  let firstName = req.body.firstName;
  try {
    let message = "First name has been updated";
    // check if pernal info exists for user id
    let checkIfPersonalInfoExists = await db.personal_info.singlePerson(userId);
    // if none exsists;  create one THEN add name(so we can reuse the func and not have like 3 new ones)
    if (checkIfPersonalInfoExists.length > 0) {
      // PI exists
      await db.personal_info.updateFirstNameForUserId(userId, firstName);
    } else {
      // PI does not exist
      await db.personal_info.insertNewPersonalInfoWithUserId(userId);
      await db.personal_info.updateFirstNameForUserId(userId, firstName);
      message =
        "Personal info has been created and first name has been added successfully";
    }
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong update/adding first name" });
  }
});

router.put("/updateLastName", hasValidAdminToken, async (req, res) => {
  let userId = req.body.userId;
  let lastName = req.body.lastName;
  try {
    let message = "Last name has been updated";
    // check if pernal info exists for user id
    let checkIfPersonalInfoExists = await db.personal_info.singlePerson(userId);
    // if none exsists;  create one THEN add name(so we can reuse the func and not have like 3 new ones)
    if (checkIfPersonalInfoExists.length > 0) {
      // PI exists
      await db.personal_info.updateLastNameForUserId(userId, lastName);
    } else {
      // PI does not exist
      await db.personal_info.insertNewPersonalInfoWithUserId(userId);
      await db.personal_info.updateLastNameForUserId(userId, lastName);
      message =
        "Personal info has been created and last name has been added successfully";
    }
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong update/adding last name" });
  }
});

router.put("/", async (req, res) => {
  try {
    console.log(req.body);
    res.json(await db.personal_info.updatePerson(req.body));
  } catch (error) {
    console.log(error);
    console.log("somethings messing up here");
    res.sendStatus(500);
  }
});

router.delete("/:id", async (req, res) => {
  let id = Number(req.params.id);
  try {
    res.json(await db.personal_info.deletePerson(id));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
