// "use client";
// import { ApiClient, LoginResponseSchema } from '@/api';
// import React, { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { z } from 'zod';

// const roleQSchema = z.object({
//   role: z.string(),
// })
// type roleQParams = z.infer<typeof roleQSchema>;

// export default function MockPage() {
//   const router = useRouter();
//   const axiosInstance = ApiClient.getInstance();
//   const queryParams = useSearchParams();
//   useEffect(() => {
//     if (!queryParams)
//       return;
//     const param: roleQParams = {
//       role: queryParams.get('role') ?? "ADMIN"
//     }

//     axiosInstance.get('/test/tokens', LoginResponseSchema, { params: param }).then(res => {
//       const token = res.accessToken;
//       if (token?.trim()) {
//         router.push('admin/login');
//       }
//     });
//   }, [axiosInstance, queryParams, router]);

//   return (
//     <div className="container">
//       asjdflkjaskldjflajsd
//       asdklljfalksdjkflj
//     </div>
//   );
// };
