import { describe, it, expect } from "vitest";
import {
  accountSetupSchema,
  groupDetailsSchema,
  inviteMembersSchema,
} from "../types/njangi.form.schema.type";

global.FileList = class FileList extends Array<File> {
  item(index: number) {
    return this[index] || null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe("accountSetupSchema", () => {
  it("should fail if passwords do not match", () => {
    const result = accountSetupSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      phoneNum: "+237650123456",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password321",
      profilePic: undefined,
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().confirmPassword?._errors).toContain(
      "Passwords do not match"
    );
  });

  it("should pass with valid data", () => {
    const result = accountSetupSchema.safeParse({
      firstName: "Jane",
      lastName: "Doe",
      phoneNum: "+237650123456",
      email: "jane@example.com",
      password: "strongpassword",
      confirmPassword: "strongpassword",
      profilePic: undefined,
    });
    expect(result.success).toBe(true);
  });
});

describe("groupDetailsSchema", () => {
  it("should fail if contributionAmount is not a number", () => {
    const result = groupDetailsSchema.safeParse({
      groupName: "Test Group",
      contributionAmount: "abc",
      contributionFrequency: "Weekly",
      payoutMethod: "Rotation",
      startDate: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().contributionAmount?._errors).toContain(
      "Contribution amount must be a number"
    );
  });

  it("should pass with valid data", () => {
    const result = groupDetailsSchema.safeParse({
      groupName: "Clean Njangi",
      contributionAmount: "1000",
      contributionFrequency: "Monthly",
      payoutMethod: "Lottery",
      startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    });
    expect(result.success).toBe(true);
  });
});

describe("inviteMembersSchema", () => {
  it("should fail if no members are invited", () => {
    const result = inviteMembersSchema.safeParse({ invites: [] });
    expect(result.success).toBe(false);
    expect(result.error?.format().invites?._errors).toContain(
      "At least one member must be invited"
    );
  });

  it("should fail with invalid email", () => {
    const result = inviteMembersSchema.safeParse({
      invites: [{ type: "email", value: "not-an-email" }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().invites?.[0]?.value?._errors).toContain(
      "Please enter a valid email address"
    );
  });

  it("should pass with valid phone and email", () => {
    const result = inviteMembersSchema.safeParse({
      invites: [
        { type: "email", value: "user@example.com" },
        { type: "phone", value: "+237650123456" },
      ],
    });
    expect(result.success).toBe(true);
  });
});
