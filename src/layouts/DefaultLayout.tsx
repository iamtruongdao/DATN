import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { motion } from 'framer-motion'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Header />
        {/* <div className='flex justify-center flex-col items-center overflow-hidden '> */}
        <Outlet />
        {/* </div> */}
        <Footer />
      </motion.div>
    </>
  )
}

export default DefaultLayout
