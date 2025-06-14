import { COURSES, EDUCATIONAL_PROGRAMS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertEnrollmentSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

// Import madrasa images
import masjidMadrasaImg from '@assets/madersa-students.webp';
import madrasaModernImg from '@assets/madersa-modern.webp';

const ProgramIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'book':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      );
    case 'award':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case 'scroll':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
          <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      );
    case 'language':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.8 2.4a1 1 0 01-.95.68H3.75a1 1 0 110-2h2.7l.8-2.4a1 1 0 01.95-.68H9V3a1 1 0 011-1zm4 10.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm0-2a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
};

interface EnrollmentFormData {
  courseId: string;
  studentName: string;
  guardianName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

// Extend the schema for the form
const extendedSchema = insertEnrollmentSchema.extend({
  age: z.preprocess(
    (val) => Number(val),
    z.number().min(5, { message: "Student must be at least 5 years old" }).max(70, { message: "Invalid age" })
  ),
  phone: z.string().min(10, { message: "Phone number is too short" }),
});

const MadrasaPage = () => {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Extract courseId from URL query parameters if any
  const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  };
  
  const initialCourseId = getQueryParam('course') || '';
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EnrollmentFormData>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      courseId: initialCourseId,
      age: 0,
    }
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      setIsSubmitting(true);
      await apiRequest('POST', '/api/enroll', data);
      
      toast({
        title: "Enrollment Submitted",
        description: "Your enrollment request has been received. We will contact you soon.",
      });
      
      reset();
    } catch (error) {
      console.error('Enrollment submission error:', error);
      toast({
        title: "Enrollment Failed",
        description: "There was an error submitting your enrollment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extended content for educational programs
  const programDetails = [
    {
      title: 'Quran Reading & Tajweed',
      description: 'Learn proper Quranic recitation with correct pronunciation and tajweed rules.',
      icon: 'book',
      details: 'Our Quran reading program is designed to teach students of all ages how to correctly read the Quran with proper tajweed rules. The curriculum begins with learning the Arabic alphabet and progresses to reading from the Quran. Students learn the rules of pronunciation, articulation points of letters, and the proper flow of recitation. Classes are divided by age and proficiency levels to ensure each student receives appropriate instruction.',
      outcomes: [
        'Ability to read the Quran with proper tajweed',
        'Understanding of tajweed rules and their application',
        'Improved Arabic pronunciation skills',
        'Appreciation for the beauty of Quranic recitation'
      ]
    },
    {
      title: 'Hifz Program (Memorization)',
      description: 'Comprehensive program for memorizing the entire Quran under qualified huffaz.',
      icon: 'award',
      details: 'Our Hifz program offers a structured approach to memorizing the entire Quran under the guidance of experienced huffaz (Quran memorizers). The program incorporates proven memorization techniques and regular revision sessions. Students are taught the importance of quality over quantity, ensuring strong retention. The curriculum includes understanding the meaning of verses being memorized to enhance the connection with the text.',
      outcomes: [
        'Progressive memorization of the Holy Quran',
        'Strong revision and retention strategies',
        'Development of concentration and discipline',
        'Understanding of memorized portions'
      ]
    },
    {
      title: 'Hadith Studies',
      description: 'Study of authentic hadith collections and their applications in daily life.',
      icon: 'scroll',
      details: 'Our Hadith studies program focuses on teaching students about the sayings and actions of Prophet Muhammad ﷺ. Students learn from authentic collections like Sahih Bukhari, Sahih Muslim, and others. The course covers the methodology of hadith authentication, the historical context of various narrations, and their practical applications in contemporary life. Special emphasis is placed on understanding the Prophet\'s character and implementing his teachings.',
      outcomes: [
        'Knowledge of authentic hadith collections',
        'Understanding of hadith authentication methods',
        'Ability to apply Prophetic teachings in daily life',
        'Awareness of the Prophet\'s character and conduct'
      ]
    },
    {
      title: 'Arabic Language',
      description: 'Learn Arabic grammar, vocabulary, and conversation skills.',
      icon: 'language',
      details: 'Our Arabic language program is structured to provide students with a comprehensive understanding of the Arabic language. The curriculum covers basic vocabulary, essential grammar rules, sentence construction, and conversation skills. Students progress through levels from beginner to advanced, with each level building upon previous knowledge. The course emphasizes Quranic Arabic, enabling students to better understand Islamic texts in their original language.',
      outcomes: [
        'Reading and writing skills in Arabic',
        'Understanding of Arabic grammar and syntax',
        'Development of conversation skills',
        'Ability to understand Islamic texts in Arabic'
      ]
    }
  ];

  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-heading text-[#0C6E4E] mb-4">دَرس و تربیت نبوی</h1>
          <h2 className="text-2xl md:text-3xl font-heading text-[#0C6E4E] mb-6">Online Dars e Nizami Madersa Academy of Islamic Knowledge</h2>
          <p className="text-xl text-center max-w-3xl mx-auto">Providing comprehensive Islamic education through structured courses from Quran, Hadith, Fiqh, and Arabic Grammar for students of all ages and backgrounds.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img src={masjidMadrasaImg} alt="Students learning Quran" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
          
          <div>
            <h2 className="text-3xl font-heading text-[#0C6E4E] mb-6">About Our Madrasa</h2>
            <div className="prose max-w-none mb-6">
              <p>Jamia Masjid Nabvi Qureshi Hashmi's Madrasa is dedicated to providing high-quality Islamic education to Muslims of all ages and backgrounds. Our comprehensive curriculum is designed to nurture a deep understanding of Islamic teachings and practices while fostering spiritual growth and character development.</p>
              <p>Our experienced teachers are not only knowledgeable in Islamic sciences but also trained in effective teaching methodologies. We maintain small class sizes to ensure personalized attention for each student, and our facilities are designed to create a conducive learning environment.</p>
              <p>We believe that Islamic education should be accessible to everyone, which is why we offer flexible scheduling options, including weekend and evening classes, as well as online learning opportunities for those who cannot attend in person.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Teaching Methodology</h3>
              <p className="mb-4">Our teaching methodology is based on the guidance of the Quran and Sunnah. We believe in a balanced approach that respects traditional Islamic scholarship while incorporating modern educational techniques.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Video lessons with detailed explanations
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Live interactive sessions with teachers
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Self-paced learning materials
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Regular assignments and assessments
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Personalized feedback and progress tracking
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-medium text-[#0C6E4E] mb-4">Madrasa Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Qualified and experienced teachers
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Comprehensive Islamic curriculum
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Age-appropriate teaching methods
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Modern facilities with traditional values
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Regular progress assessments and feedback
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-heading text-[#0C6E4E] text-center mb-8">Educational Programs</h2>

          <div className="mb-8 flex flex-col items-center">
            <img src={madrasaModernImg} alt="Modern Islamic Education" className="rounded-lg shadow-lg max-w-3xl w-full h-auto mb-6" />
            <p className="text-lg text-center max-w-3xl mx-auto">Blending tradition with modern teaching methods to provide a comprehensive Islamic education for all age groups.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {programDetails.map((program, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-[#0C6E4E] bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                      <ProgramIcon name={program.icon} />
                    </div>
                    <h3 className="text-xl font-heading text-[#0C6E4E]">{program.title}</h3>
                  </div>
                  
                  <p className="mb-4">{program.details}</p>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-[#0C6E4E] mb-2">Learning Outcomes</h4>
                    <ul className="space-y-1">
                      {program.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-heading text-[#0C6E4E] text-center mb-8">Course Schedule</h2>
          
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-6">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#0C6E4E] text-white">
                  <th className="py-3 px-4 text-left">Course</th>
                  <th className="py-3 px-4 text-left">Age Group</th>
                  <th className="py-3 px-4 text-left">Schedule</th>
                  <th className="py-3 px-4 text-left">Instructor</th>
                  <th className="py-3 px-4 text-left">Enrollment</th>
                </tr>
              </thead>
              <tbody>
                {COURSES.map((course, index) => (
                  <tr key={index} className={`border-b border-gray-200 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="py-3 px-4">{course.name}</td>
                    <td className="py-3 px-4">{course.ageGroup}</td>
                    <td className="py-3 px-4">{course.schedule}</td>
                    <td className="py-3 px-4">{course.instructor}</td>
                    <td className="py-3 px-4">
                      <button 
                        className="text-[#D4AF37] hover:underline"
                        onClick={() => {
                          const element = document.getElementById('enrollment-form');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div id="enrollment-form" className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-[#0C6E4E] text-center mb-6">Enrollment Form</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block font-medium mb-2" htmlFor="courseId">Select Course</label>
              <select 
                id="courseId" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                {...register('courseId')}
              >
                <option value="">Select a course</option>
                {COURSES.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId.message}</p>}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-2" htmlFor="studentName">Student Name</label>
                <input 
                  type="text" 
                  id="studentName" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('studentName')}
                />
                {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName.message}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-2" htmlFor="guardianName">Guardian/Parent Name</label>
                <input 
                  type="text" 
                  id="guardianName" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('guardianName')}
                />
                {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName.message}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-2" htmlFor="age">Age</label>
                <input 
                  type="number" 
                  id="age" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('age')}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-2" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('email')}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-medium mb-2" htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('phone')}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label className="block font-medium mb-2" htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C6E4E]"
                  {...register('address')}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                className="bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors inline-flex items-center disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Enrollment Application'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-16 bg-[#0C6E4E] text-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-heading text-center mb-6">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-3">What age groups do you accept?</h3>
              <p>We have programs for students aged 5 and above. Different courses have different age requirements based on the curriculum and complexity.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">Are there separate classes for males and females?</h3>
              <p>Yes, we provide separate classes for male and female students above the age of 10, although the curriculum remains the same for both.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">What are the fees for courses?</h3>
              <p>Our fees vary by course. We offer scholarships and financial assistance for deserving students. Please contact us for detailed fee information.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">Do you offer online classes?</h3>
              <p>Yes, we offer online options for most of our courses to accommodate students who cannot attend in person due to distance or schedule constraints.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">How are students assessed?</h3>
              <p>We conduct regular assessments through recitation tests, written exams, and practical demonstrations. Progress reports are provided to parents/guardians.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">Can adults join the courses?</h3>
              <p>Absolutely! We have dedicated adult classes for all our programs, designed to accommodate work schedules and adult learning styles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MadrasaPage;
