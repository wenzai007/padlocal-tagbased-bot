"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatUserInfo = void 0;
const typeorm_1 = require("typeorm");
let WechatUserInfo = class WechatUserInfo {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WechatUserInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "wxid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "weixinName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], WechatUserInfo.prototype, "isFriend", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatUserInfo.prototype, "talktimes", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatUserInfo.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatUserInfo.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WechatUserInfo.prototype, "alias", void 0);
WechatUserInfo = __decorate([
    (0, typeorm_1.Entity)()
], WechatUserInfo);
exports.WechatUserInfo = WechatUserInfo;
//# sourceMappingURL=WechatUserInfo.js.map