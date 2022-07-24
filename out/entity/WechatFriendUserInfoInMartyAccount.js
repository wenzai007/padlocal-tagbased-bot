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
exports.WechatFriendUserInfoInMartyAccount = void 0;
const typeorm_1 = require("typeorm");
let WechatFriendUserInfoInMartyAccount = class WechatFriendUserInfoInMartyAccount {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], WechatFriendUserInfoInMartyAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "wxid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "weixinName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", charset: "utf8", collation: "utf8_bin" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean"),
    __metadata("design:type", Boolean)
], WechatFriendUserInfoInMartyAccount.prototype, "isFriend", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatFriendUserInfoInMartyAccount.prototype, "talktimes", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatFriendUserInfoInMartyAccount.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], WechatFriendUserInfoInMartyAccount.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WechatFriendUserInfoInMartyAccount.prototype, "alias", void 0);
WechatFriendUserInfoInMartyAccount = __decorate([
    (0, typeorm_1.Entity)()
], WechatFriendUserInfoInMartyAccount);
exports.WechatFriendUserInfoInMartyAccount = WechatFriendUserInfoInMartyAccount;
//# sourceMappingURL=WechatFriendUserInfoInMartyAccount.js.map