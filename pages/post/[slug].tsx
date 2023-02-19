import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { sanityClient } from '../../sanity'
import { Post } from '../../typings'
import { useRouter } from 'next/router'
import PortableText from 'react-portable-text'
import {useForm, SubmitHandler } from 'react-hook-form'



interface IformInput {
    name: string;
    _id: string;
    email: string;
    comment: string;

}
interface Props {
    post: Post;
}


const Post = ({post}: Props) => {

    const [ submitted, setSubmitted ] = useState(false);
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit: SubmitHandler<IformInput> = async(data, e)=>{
        e.preventDefault();
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then ((data)=>{
            console.log(data);
            setSubmitted(true)
            
        }).catch((err)=>{
            console.log(err)
            setSubmitted(false)
        })
    }


  return (
    <main>
        <Header />

       <img src={post?.mainImage?.asset?.url} alt="" 
        className='w-full h-40 object-cover'
       />
       <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post?.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post?.description}</h2>

            <div className='flex items-center space-x-l'>
                <img src={post?.author?.image?.asset?.url} alt="" 
                    className='h-10 w-10 rounded-full'
                />
                <p className='font-extralight text-sm'>
                    Blog post by <span className='text-green-500'>{post?.author?.name}</span>
                    &nbsp; - Published at {new Date(post?._createdAt).toDateString()}
                </p>
            </div>

            <div className=''>
                <PortableText 
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                    projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                    content={post?.body}
                    serializers={{
                        h1:( props: any) => {
                            <h1 className='text-2xl font-bold my-5' {...props}/>
                        },
                        h2:( props: any) => {
                            <h2 className='text-xl font-bold my-5' {...props}/>
                        },
                        li:( {children}: any) => {
                            <li className='ml-4 list-none'>{children}</li>
                        },
                        link:( {href, children}: any) => {
                            <a href={href} className="text-blue-500 hover:underline">{children}</a>
                        },
                    }}
                />
            </div>
       </article>
        

        {
            submitted ? (
                <div className='max-w-2xl mx-auto bg-yellow-600 uppercase p-4 pb-2 text-gray-200'>
                    <h1 className='text-3xl'>submitted!</h1>
                    <p>Once your comment is approved, it will appear below</p>
                </div>
            ): (
                <form className='flex flex-col p-5 max-w-2xl mx-auto mb-16' onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-sm text-yellow-500'>Do you like this article?</h3>
                <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                <hr className='py-3 mt-2'
                />
    
    
                <input 
                    {...register("_id")}
                    type="hidden" 
                    name='_id'
                    value={post?._id}
                />
                <label className='block mb-5'>
                    <span className='text-gray-700'>Name</span>
                    <input 
                        {...register("name", {required:true})}
                        className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
                        placeholder='enter name'
                        type="text" 
                    />
                </label>
                <label className='block mb-5'>
                        <span className='text-gray-700'>Email</span>
                        <input 
                            {...register("email", {required:true})}
                            className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
                            placeholder='enter mail'
                            type="text" 
                        />
                </label>
                <label className='block mb-5'>
                    <span className='text-gray-700'>Comment</span>
                    <textarea 
                        {...register("comment", {required:true})}
                        className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring'
                        placeholder='enter your comment'
                        rows={8} 
                    />
                </label>
    
                {
                    errors && (
                    <div>
                        
                            <span className='text-red-500 text-sm'>All fields are required</span>
                      
                    </div>
                    )
                }
                <input type="submit" className='shadow bg-yellow-500 hover:bg-yellow-400 text-gray-100 rounded-full outline-none cursor-pointer' />
                
           </form>
            )
        }

        <section className='flex flex-col p-10 my-10 max-w-2xl mx-auto
        shadow-yellow-500 shadow space-y-2'>
            <h1 className='text-4xl'>Comments</h1>

            <hr className='pb-2'/>

            {post?.comments?.map((message)=>{
                return (
                    <div key={message._id}>
                        <p>
                            <span className='text-yellow-500'>{message?.name}</span>&nbsp;{message?.comment}
                        </p>
                    </div>
                )
            })}
        </section>
      
    </main>
  )
}



export const getStaticPaths = async () => {
    const query = `*[_type == "post" && defined(slug.current)][].slug.current`
    const posts = await sanityClient.fetch(query);

    return {
        paths: posts.map((slug: string)=> ({params: {slug}})),
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        author ->{
          name,
          image {
            asset ->{
              _id,
              url,
            }
          }
        },
        description,
        mainImage {
          asset ->{
            _id,
            url,
          }
        },
        'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
        slug,
        body,
    }` 
    const post = await sanityClient.fetch(query,
        {slug})

        if(!post){
            return {
                notFound: true
            }
        }
        return {
            props: {
                post,
            },
            revalidate: 60,
        }
}

export default Post;