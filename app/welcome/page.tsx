'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, BookOpen, GraduationCap, AlertCircle } from "lucide-react"
import Script from 'next/script'

export default function WelcomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KL University Attendance Calculator',
    description: 'Calculate your attendance percentage and check eligibility for KL University exams based on the University attendance policy.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    creator: {
      '@type': 'Organization',
      name: 'KL University',
      url: 'https://www.kluniversity.in/'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12 w-full px-2"
      >
        <div className="relative inline-block mb-6">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground drop-shadow-sm letter-spacing-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            Attendance Calculator
          </motion.h1>
          <motion.div
            className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground font-outfit font-light max-w-2xl mx-auto px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Calculate your attendance percentage and check eligibility for exams based on the University attendance policy.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-5xl px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="flex flex-col h-full"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <Calculator className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    Simple Attendance Calculator
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Quick calculation of your attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Enter total classes and classes attended</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Get instant calculation of attendance percentage</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>See eligibility status with color-coded alerts</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <Link href="/simple" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Use Simple Calculator</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="flex flex-col h-full"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <BookOpen className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    LTPS Calculator
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Calculate attendance with different component weights
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Enter attendance for each component (Lecture, Tutorial, Practical, Skilling)</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>See individual component percentages</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Get the final weighted attendance calculation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <Link href="/ltps" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Use LTPS Calculator</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 sm:mt-12 w-full max-w-3xl px-2"
      >
        <div className="policy-card">
          <Card className="bg-transparent shadow-none border-0">
            <CardHeader className="px-5 pt-5">
              <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                <GraduationCap className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                <h2 className="text-xl font-semibold font-poppins relative inline-block">
                  Attendance Policy
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </h2>
              </div>
            </CardHeader>
            
            <CardContent className="px-5 pb-5">
              <div className="space-y-5">
                <div className="flex items-start gap-3 group hover:cursor-pointer">
                  <div className="bg-green-500/10 p-2 rounded-full flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold font-poppins relative inline-block">
                      Eligible (≥85%)
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </h3>
                    <p className="text-sm text-muted-foreground font-outfit">Your attendance is above the minimum required 85%</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 group hover:cursor-pointer">
                  <div className="bg-yellow-500/10 p-2 rounded-full flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold font-poppins relative inline-block">
                      Conditional Eligibility (75-85%)
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </h3>
                    <p className="text-sm text-muted-foreground font-outfit">You need to pay a condonation fine</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 group hover:cursor-pointer">
                  <div className="bg-red-500/10 p-2 rounded-full flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold font-poppins relative inline-block">
                      Not Eligible (&lt;75%)
                      <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </h3>
                    <p className="text-sm text-muted-foreground font-outfit">Your attendance is below 75%. You may face detention.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
} 