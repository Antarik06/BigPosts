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
  //console.log("slug",slug)
  // State for post data (existing post) and image preview
  const [postData, setPostData] = useState(post || null);
  const [imageUrl, setImageUrl] = useState(null);

  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });
  //console.log(post?.$id);
  //you can use getValues("field_name") to get ANY of the fields (title, slug, content, status),
  //only getValue() return object with all the fields
  // but it will NOT update in realtime.

  // this control initialized here is used later to pass to the RTE
  // which controls the tinyMCE editor with RHF only

// Fetch post when slug exists 
useEffect(() => {
  if (!slug) return;

  const fetchPost = async () => {
    const fetchedPost = await appwriteService.getPost(slug);
    if (fetchedPost) {
      setPostData(fetchedPost);
    } else {
      navigate("/");
    }
  };

  fetchPost();
}, [slug]);

// Load image preview any time postData changes
useEffect(() => {
  if (postData?.featuredImage) {
    appwriteService
      .getFilePreview(postData.featuredImage)
      .then((url) => setImageUrl(url));
  }
}, [postData]);


  const watchedImage = watch("image");
  // watcch(something) -> returns value of the field
  // as image is a file input field
  // it returns FileList which looks like
  //FileList {
  // 0: File { name: "...", size: ..., type: "...", ... }
  // length: 1
  //}

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const url = URL.createObjectURL(watchedImage[0]);
      setImageUrl(url);
    }
  }, [watchedImage]);

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
/*
Interesting way of slug transform without even calling it in the title input 
btw i am calling it so this is commented

useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (name === "title") {
      setValue("slug", slugTransform(value.title), { shouldValidate: true });
    }
  });
  return () => subscription.unsubscribe();
}, [watch, slugTransform, setValue]);

watch() from React Hook Form automatically receives (values, info)
every time ANY registered field changes.
info is an object and has a name field which tells where the change is happening in the form
values is the content of that field
Whenever ANY input registered with register() changes,
ReactHookForm calls the watch callback automatically.
*/


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
          // we had given default values to the title field before,
          // we are using that to fill that value in this field
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
          // setValue cahnges the field values and has 3 parameters
          // name of the field, the value to which the field need to be changed to , and options 
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
        />
        <RTE 
         label="Content :" 
         name="content" 
         control={control} 
         defaultValue={getValues("content")} />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !postData })}
          //image inputs do not get default values , it is not allowed 
          //by browsers and also not needed
          //but we still register it as ReactHokForms needs to register
          //neverthless for the form to work / get tracked

          //required: !postData 
          // -> as on new posts i require it mandatory
          // -> and on edit posts it is not mandatory
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
