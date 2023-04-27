import { Router } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import db from "../db";
//ended up not needing this. but be useful in the future so I left it
const router = Router();

router.get("/getTenantNameAndUserRole", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let [tenantName]: Array<{ tenant_name: string }> =
      await db.tenants.getTenantName(tokenVerify.tenant);
    console.log(tenantName.tenant_name);
    res.status(200).json({ tokenVerify, tenantName: tenantName.tenant_name });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getTenantName", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    res.status(200).json(await db.tenants.getTenantName(tokenVerify.tenant));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
