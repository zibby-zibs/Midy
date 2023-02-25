import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Header from '../components/Header'
import { sanityClient } from '../sanity'
import { Post } from '../typings'
import Link from 'next/link'
import { useState } from 'react'
// import styles from '../styles/Home.module.css'

interface Props {
  posts: Post[]
}
const inter = Inter({ subsets: ['latin'] })

export default function Home({posts}: Props) {

  return (
    <section className='max-w-7xl m-auto'>
      <Head>
        <title>Midy</title>
        <meta name="description" content="Figure this out yourself" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" />
      </Head>
      <Header/>
      <section className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 max-w-7xl lg:py-0'>
        <aside className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif capitalize'><span className='underline decoration-4'>midy</span> is a place to read and connect</h1>
          <h2>It&apos;s easy and free to post your thinking on any topic and connect with millions of people</h2>
        </aside>
        <aside className='hidden md:inline-flex h-32 lg:h-full'>
          <Image 
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" 
            alt="medium" 
            height={0}
            width={0}
            sizes='100%'
            className='h-32 object-cover'
          />
        </aside>
      </section>

      {/* posts */}
      <section  className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
        {posts.map((post) =>{
          return (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='border rounded-lg group cursor-pointer overflow-hidden'>
                  <Image
                    src={ post.mainImage?.asset?.url } 
                    alt=""
                    height={0}
                    width={0}
                    sizes="100%"
                    className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration 200 ease-in-out'
                  />
               <div className='flex justify-between p-5 bg-white'>
                  <div>
                    <p className='text-lg'>{post.title}</p>
                    <p className='text-sm '><span className="text-[gray]">{post.description}</span> by {post.author.name}</p> 
                  </div>
                  <Image 
                    src={post?.author?.image?.asset?.url} 
                    alt=""
                    height={0}
                    width={0}
                    sizes="100%"
                    className='h-12 w-12 rounded-full object-cover'
                  />
               </div>
            </div>
          </Link>
          )
        })}
      </section>
    </section>
  )
}


export const getServerSideProps = async()=>{
  const query = `*[_type == "post"]{
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
    slug,
    body,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}