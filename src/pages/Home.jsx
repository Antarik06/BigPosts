import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { useSelector } from "react-redux";


function Home() {
    const [posts, setPosts] = useState([])
    const isLoggedIn = useSelector((state) => state.auth.status);
    // this is the way that i can check the user login status using state.auth.status
    // similarly for userData, state.auth.userData
    useEffect(() => {
 
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
            else{
                setPosts([])
                // so that if the user logs out , the dependenncy array variable changes , 
                // this useEffect runs again and Posts are set to []
            }
        })
    }, [isLoggedIn])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home