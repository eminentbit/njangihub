// import { useMemo } from "react";
// import { useDebounce } from "../hooks/useDebounce";
// import { useForm } from "react-hook-form";
// import { AccountSetupFormData } from "../types/njangi.form.schema.type";

// const Backup = () => {
//   const { watch, setError, clearErrors } = useForm<AccountSetupFormData>();
//   const rawInvites = useMemo(() => watch("invites") ?? [], [watch]);

//   const normalizedInvites = useMemo(() => {
//     return rawInvites.map((invite) => ({
//       type: invite?.type,
//       value: (invite?.value ?? "").trim().toLowerCase(),
//     }));
//   }, [rawInvites]);

//   const debouncedInvites = useDebounce(normalizedInvites, 500);

//   // ✅ Check for duplicates locally before calling server
//   useEffect(() => {
//     const seen = new Set();
//     debouncedInvites.forEach((invite, index) => {
//       if (!invite.value) return;
//       if (seen.has(invite.value)) {
//         setError(`invites.${index}.value`, {
//           type: "manual",
//           message: "Duplicate invite. Each contact must be unique.",
//         });
//       } else {
//         seen.add(invite.value);
//         clearErrors(`invites.${index}.value`);
//       }
//     });
//   }, [debouncedInvites, setError, clearErrors]);

//   // ✅ Server-side batch validation
//   useEffect(() => {
//     const validateServerSide = async () => {
//       if (!debouncedInvites.length) return;
//       try {
//         const { data } = await axios.post(
//           `${API_URL}/validate-invite-contacts`,
//           {
//             invites: debouncedInvites,
//           }
//         );

//         data.forEach((result: any, index: number) => {
//           if (!result.valid) {
//             setError(`invites.${index}.value`, {
//               type: "manual",
//               message: result.message || "Invalid or already invited.",
//             });
//           } else {
//             clearErrors(`invites.${index}.value`);
//           }
//         });
//       } catch (err) {
//         console.error("Server validation error:", err);
//       }
//     };
//     validateServerSide();
//   }, [debouncedInvites, setError, clearErrors]);
// };

// export default Backup;
