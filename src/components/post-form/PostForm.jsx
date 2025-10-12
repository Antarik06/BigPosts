import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const userData = useSelector((state) => state.auth.userData);

  // State for post data (existing post) and image preview
  const [postData, setPostData] = useState(post || null);
  const [imageUrl, setImageUrl] = useState(post?.featuredImage ? null : null);

  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  // Fetch post if slug exists
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const fetchedPost = await appwriteService.getPost(slug);
      if (fetchedPost) {
        setPostData(fetchedPost);
        if (fetchedPost.featuredImage) {
          const url = await appwriteService.getFilePreview(fetchedPost.featuredImage);
          setImageUrl(url);
        }
      } else {
        navigate("/");
      }
    };

    if (!postData) fetchPost();
  }, [slug, navigate, postData]);

  // Preview selected file immediately
  const watchedImage = watch("image");
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const url = URL.createObjectURL(watchedImage[0]);
      setImageUrl(url);
    }
  }, [watchedImage]);

  // Slug transformation
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Submit handler
  const submit = async (data) => {
    try {
      let fileId;

      // If user selected a new image
      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) fileId = file.$id;

        // Delete old image if updating
        if (postData?.featuredImage) {
          await appwriteService.deleteFile(postData.featuredImage);
        }
      }

      if (postData) {
        // Update existing post
        const dbPost = await appwriteService.updatePost(postData.$id, {
          ...data,
          featuredImage: fileId || postData.featuredImage,
        });
        if (dbPost) navigate(`/post/${dbPost.$id}`);
      } else {
        // Create new post
        if (!fileId) return alert("Featured image is required for new posts");
        data.featuredImage = fileId;

        const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });
        if (dbPost) navigate(`/post/${dbPost.$id}`);
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("Something went wrong while saving the post.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !postData })}
        />
        {imageUrl && (
          <div className="w-full mb-4">
            <img src={imageUrl} alt={postData?.title || "Preview"} className="rounded-lg" />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={postData ? "bg-green-500" : undefined} className="w-full">
          {postData ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
