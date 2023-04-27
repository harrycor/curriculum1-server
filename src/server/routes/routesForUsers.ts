import { Router } from "express";
import { verify } from "jsonwebtoken";
import { hasValidAdminToken, hasValidToken } from "../utils/tokenCheck";
import db from "../db";
import config from "../config";

const router = Router();

router.get("/:id?", async (req, res) => {
  let id = Number(req.params.id);
  try {
    if (id) {
      res.json(await db.users.singleUser(id));
    } else {
      res.json(await db.users.all());
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/getAccountInfoForUser", hasValidToken, async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userId = tokenVerify.userId;
    res
      .status(200)
      .json(
        await db.users.getSingleUserWithPersonalInfoForUserWithUserId(userId)
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to get user info" });
  }
});

// WC added this route to display all users for a specific tenant
router.post(
  "/getAllAccountsInTenantForAdmin",
  hasValidAdminToken,
  async (req, res) => {
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenant = tokenVerify.tenant;
      console.log(tenant);
      res
        .status(200)
        .json(
          await db.users.getAllUsersWithPersonalInfoInTenantForAdmin(tenant)
        );
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Something is going wrong trying to get all users" });
    }
  }
);

router.post("/", hasValidAdminToken, async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
    let real_email = req.body.real_email;
    let phone_number = req.body.phone_number;
    let war_zone_id = req.body.war_zone_id;
    let tenantName = req.body.tenant;
    let on_do_not_text_list = 0;

    // Harrys
    let tenantId: any = await db.tenants.createNewTenant(tenantName);
    let tenant = tenantId.insertId;
    res.json(
      await db.users.createUser({
        email,
        password,
        role,
        real_email,
        tenant,
        phone_number,
        war_zone_id,
        on_do_not_text_list,
      })
    );
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/forAdminCreatedAccounts",
  hasValidAdminToken,
  async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      let role = req.body.role;
      let real_email = req.body.real_email;
      let tenant = req.body.tenant;
      let first_name = req.body.first_name;
      let last_name = req.body.last_name;
      let phone_number = req.body.phone_number;
      let on_do_not_text_list = req.body.doNotTextList === true ? 1 : 0;

      let war_zone_id: any = Number(req.body.war_zone_id)
        ? Number(req.body.war_zone_id)
        : null;
      let notes = "";
      const returnedFromSql: { insertId: number } = await db.users.createUser({
        email,
        password,
        role,
        real_email,
        phone_number,
        war_zone_id,
        tenant,
        on_do_not_text_list,
      });

      await db.personal_info.createPersonFromAdminCreate(
        first_name,
        last_name,
        notes,
        returnedFromSql.insertId
      );
      res.status(200).json({ message: "Worked." });
    } catch (error) {
      let message = "Something went wrong trying to create new account";
      if (error.code === "ER_DUP_ENTRY") message = error.sqlMessage;
      console.log(req.body);
      console.log(error);
      res.status(500).json({ message });
    }
  }
);

// We should not just leave request.body here we should always asign each part to a variable an duse it for the sql query
router.put("/", hasValidAdminToken, async (req, res) => {
  try {
    res.json(await db.users.updateUser(req.body));
  } catch (error) {
    console.log(error);
    console.log("somethings messing up here");
    res.sendStatus(500);
  }
});

router.delete("/:id", hasValidAdminToken, async (req, res) => {
  let id = Number(req.params.id);
  try {
    await db.users.deleteCorrespondingGrades(id);
    await db.users.deleteCorrespondingPersonal_info(id);
    await db.users.deleteUser(id);
    res.json(
      "hopefully deleted users after deleting corresponding personal_info and grades"
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put("/passwordReset", async (req, res) => {
  let user_id = req.body.user_id;
  let newPassword = req.body.newPassword;
  try {
    res.json(await db.users.resetPassword(user_id, newPassword));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put("/resetPasswordFromAdminOrUser", hasValidToken, async (req, res) => {
  let userId = req.body.userId;
  let newPassword = req.body.password;
  try {
    await db.users.resetPassword(userId, newPassword);
    res.status(200).json({ message: "Pass has been updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to update password" });
  }
});

router.put(
  "/resetPhoneNumberFromAdminOrUser",
  hasValidToken,
  async (req, res) => {
    let userId = req.body.userId;
    let newPhoneNumber = req.body.newPhoneNumber;
    try {
      await db.users.resetPhoneNumber(userId, newPhoneNumber);
      res.status(200).json({ message: "Phone number has been updated" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Something went wrong updating phone number" });
    }
  }
);

router.put("/updateOnDoNotTextList", hasValidToken, async (req, res) => {
  let userId = req.body.userId;
  let onDoNotTextList = req.body.onDoNotTextList === true ? 1 : 0;
  try {
    await db.users.updateOnDoNotTextList(userId, onDoNotTextList);
    res
      .status(200)
      .json({ message: "Do not text list status has been updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong updating Do not text list status",
    });
  }
});

router.put("/resetWarZoneIdFromAdmin", hasValidAdminToken, async (req, res) => {
  let userId = req.body.userId;
  let newWarZoneId = req.body.newWarZoneId;
  try {
    await db.users.resetWarZoneId(userId, newWarZoneId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put("/updateRealEmail", hasValidToken, async (req, res) => {
  let userId = req.body.userId;
  let realEmail = req.body.realEmail;
  try {
    await db.users.updateRealEmail(userId, realEmail);
    res.status(200).json({ message: "Email has been updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to update Email" });
  }
});

router.put("/resetEmailFromAdmin", hasValidAdminToken, async (req, res) => {
  let userId = req.body.userId;
  let email = req.body.email;
  try {
    await db.users.updateEmail(userId, email);
    res.status(200).json({ message: "Username has been updated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to update username" });
  }
});

router.put("/updateRole", async (req, res) => {
  let user_id = req.body.userId;
  let newRole = req.body.role;
  try {
    await db.users.updateRoleOnly(user_id, newRole);
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong when trying to update role" });
  }
});

router.get("/gettingYourUser_Ids/:email", async (req, res) => {
  try {
    let email = req.params.email;
    res.json(await db.users.getAllUserIDsForPasswordReset(email));
  } catch (error) {}
});

router.post("/getAllUsersInTenantWithNames", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    res.json(await db.users.getAllUsersInTenantWithNames(tokenVerify.tenant));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.post("/getAllCoachsAndAdminsInTenantWithNames", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    res.json(
      await db.users.getAllCoachsAndAdminsInTenantWithNames(tokenVerify.tenant)
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put("/activateUser/:userId", hasValidAdminToken, async (req, res) => {
  let userId = Number(req.params.userId);
  try {
    await db.users.activateUser(userId);
    res.status(200).json({ message: "Account had been activated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to activate account" });
  }
});
router.put("/deactivateUser/:userId", hasValidAdminToken, async (req, res) => {
  let userId = Number(req.params.userId);
  try {
    await db.users.deactivateUser(userId);
    res.status(200).json({ message: "Account has been deactivated" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to deactivate account" });
  }
});

router.post("/getUserIdAndRoleFromToken", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let userId = await tokenVerify.userId;
    let role = await tokenVerify.role;
    res.status(200).json({ userId, role });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
