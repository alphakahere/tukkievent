import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export interface UploadResponse {
	/** Server-root-relative path (e.g. `/api/uploads/abc.jpg`). Use `assetUrl` to render. */
	path: string;
	filename: string;
	mimeType: string;
	size: number;
}

export const uploadsApi = createApi({
	reducerPath: "uploadsApi",
	baseQuery,
	endpoints: (builder) => ({
		uploadImage: builder.mutation<UploadResponse, File>({
			query: (file) => {
				const formData = new FormData();
				formData.append("file", file);
				return {
					url: "/uploads/image",
					method: "POST",
					body: formData,
				};
			},
		}),
	}),
});

export const { useUploadImageMutation } = uploadsApi;
