"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouters = void 0;
const express_1 = require("express");
const fileUploader_1 = require("../../helper/fileUploader");
const admin_validation_1 = require("./admin.validation");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.post("/create-admin", fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = admin_validation_1.UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data));
    return admin_controller_1.UserController.createAdmin(req, res, next);
});
router.get("/", admin_controller_1.UserController.getAllFromDB);
router.get('/:id', admin_controller_1.UserController.getByIdFromDB);
router.patch("/:id", fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    return admin_controller_1.UserController.updateAdminProfileById(req, res, next);
});
router.delete('/:id', admin_controller_1.UserController.deleteFromDB);
exports.AdminRouters = router;
