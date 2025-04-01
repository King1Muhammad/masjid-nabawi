import { COURSES, EDUCATIONAL_PROGRAMS } from '@/lib/constants';
import { Link } from 'wouter';

interface ProgramIconProps {
  name: string;
}

const ProgramIcon = ({ name }: ProgramIconProps) => {
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

const Madrasa = () => {
  return (
    <section id="madrasa" className="py-16 bg-[#0C6E4E] bg-opacity-5" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230C6E4E' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-[#0C6E4E] mb-4">Our Madrasa</h2>
          <p className="max-w-3xl mx-auto">Providing comprehensive Islamic education through structured courses for students of all ages and backgrounds.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="../assets/IMG_20230318_144743_2.jpg" alt="Students at our Madrasa" className="rounded-lg shadow-lg w-full h-auto" />
          </div>
          
          <div>
            <h3 className="text-2xl font-heading text-[#0C6E4E] mb-4">Educational Programs</h3>
            <p className="mb-6">Our Madrasa offers a range of educational programs designed to nurture Islamic knowledge and spiritual growth in a supportive environment.</p>
            
            <div className="space-y-4">
              {EDUCATIONAL_PROGRAMS.map((program, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-heading text-[#0C6E4E] flex items-center">
                    <ProgramIcon name={program.icon} />
                    <span className="ml-2">{program.title}</span>
                  </h4>
                  <p className="text-sm mt-1">{program.description}</p>
                </div>
              ))}
            </div>
            
            <Link href="/madrasa">
              <a className="mt-8 inline-block bg-[#0C6E4E] hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors">
                Enroll in Courses
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-heading text-[#0C6E4E] mb-8 text-center">Course Schedule</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
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
                      <Link href={`/madrasa?course=${course.id}`}>
                        <a className="text-[#D4AF37] hover:underline">Apply</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Madrasa;
