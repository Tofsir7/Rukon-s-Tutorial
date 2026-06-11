import { SITE } from '../../utils/constants';

const AboutPage = () => (
  <div>
    <section className="bg-primary-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-primary-200 mt-2">Learn more about {SITE.name}</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">{SITE.about}</p>
          <p className="text-gray-600 leading-relaxed"><strong>Target Audience:</strong> {SITE.targetAudience}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card border-l-4 border-primary-600">
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600 italic">"{SITE.mission}"</p>
          </div>
          <div className="card border-l-4 border-accent-500">
            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600">To become the most trusted coaching center in Kishoreganj, producing academically excellent and morally upright citizens.</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Our Teaching Method</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex gap-2"><span className="text-primary-600">✓</span> Concept-based learning with clear explanations</li>
            <li className="flex gap-2"><span className="text-primary-600">✓</span> Regular class tests and monthly examinations</li>
            <li className="flex gap-2"><span className="text-primary-600">✓</span> Small batch sizes for individual attention</li>
            <li className="flex gap-2"><span className="text-primary-600">✓</span> Study materials and recorded class access</li>
            <li className="flex gap-2"><span className="text-primary-600">✓</span> Both online and offline class options</li>
          </ul>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <img src="/images/classroom.jpeg" alt="Classroom" className="rounded-xl object-cover h-48 w-full" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop'; }} />
          <img src="/images/classroom-2.jpeg" alt="Office Room" className="rounded-xl object-cover h-48 w-full" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop'; }} />
          <img src="/images/officeroom.jpeg" alt="Office Room" className="rounded-xl object-cover h-48 w-full" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop'; }} />
          <img src="/images/officeroom-2.jpeg" alt="Office Room" className="rounded-xl object-cover h-48 w-full" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop'; }} />
          
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
