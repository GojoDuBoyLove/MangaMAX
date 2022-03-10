import { NextPage } from 'next';
import React, { useState } from 'react';
import { getComicInfo } from '../../../shared/api/comic';
import { ComicProps } from '../../../shared/types';
import { RiSortDesc } from 'react-icons/ri';
import { useSelector } from 'react-redux'
import { wrapper } from '../../../store';
import { handleSource } from '../../../store/action';
import RightComic from '../../../components/RightComic';
import LeftComic from '../../../components/LeftComic';
import { FaChevronLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { titleCase } from '../../../shared/cmanga/titleCase';
import Head from 'next/head';

const Comic: NextPage<ComicProps> = ({ info, slug }) => {
    const select: any = useSelector((state: any) => state.reducer);
    const { reducer3 }: any = useSelector((state: any) => state);
    const navigate = useRouter();
    const [dt, setDt] = useState<any>(info);
    const handleSort = () => {
        setDt({
            ...dt,
            chapters: dt.chapters.slice().reverse()
        });
    }

    return (
        <>
            <Head>
                <title>{info.title}</title>
            </Head>
            <div className='px-[2vw] lg:px-[5vw] lg:h-[92.5vh] pt-10 pb-3 flex flex-col lg:flex-row relative lg:max-h-[100vh] overflow-hidden gap-3'>
                <h1
                    onClick={() => navigate.push(reducer3.keyword ? `/search/?source=${select.source}&type=${select.type}&keyword=${encodeURI(reducer3.keyword)}` : `/?source=${select.source}&type=${select.type}`)}
                    title='Go Back'
                    className='absolute top-[4px] text-2xl font-bold -ml-[0.3rem] hover:text-white'>
                    <FaChevronLeft className='inline mb-[0.3rem]' /> {titleCase(select.type)}
                </h1>
                {/* Left Side */}
                <LeftComic
                    info={info}
                    select={select}
                    slug={slug}
                />
                {/* Right Side */}
                <p className='lg:hidden font-bold text-xl my-2 flex justify-between items-center'>
                    Chapters <span><RiSortDesc onClick={() => handleSort()} size={28} /></span>
                </p>
                <RightComic
                    dt={dt}
                    handleSort={handleSort}
                    slug={slug}
                    select={select}
                />
            </div >
        </>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async ({ params, query }) => {
        store.dispatch<any>(handleSource(query.source, query.type, store));

        try {
            const data = await getComicInfo(params?.slug as string);

            if (data.status >= 400) {
                return {
                    props: {
                        statusCode: data.status
                    }
                }
            }
            return {
                props: {
                    slug: params?.slug,
                    info: data
                }
            };
        } catch (error) {
            console.log(error);
            return {
                notFound: true
            };
        }
    }
);

export default Comic;