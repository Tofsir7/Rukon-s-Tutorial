const ResultsPage = () => (
  <div>
    <section className="bg-primary-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold">Results & Success</h1>
        <p className="text-primary-200 mt-2">Celebrating our students' achievements</p>
      </div>
    </section>

    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { year: 'SSC 2024', stat: '92%', label: 'Pass Rate' },
            { year: 'HSC 2024', stat: '45+', label: 'A+ Results' },
            { year: 'JSC 2024', stat: '100%', label: 'Pass Rate' },
          ].map((item) => (
            <div key={item.year} className="card text-center">
              <div className="text-3xl font-bold text-primary-700">{item.stat}</div>
              <div className="text-gray-600 text-sm">{item.label}</div>
              <div className="font-semibold mt-1">{item.year}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
        <div className="space-y-4">
          {[
            { name: 'Arif Hossain', exam: 'SSC 2024', result: 'GPA 5.00 (Science)', quote: 'Rukon Sir helped me understand math concepts clearly. Best coaching in Katiadi!' },
            { name: 'Sadia Akter', exam: 'HSC 2024', result: 'GPA 5.00', quote: 'The regular tests and study materials made all the difference in my preparation.' },
            { name: 'Rahim Khan', exam: 'Medical Admission', result: 'Dhaka Medical College', quote: 'Admission prep batch was exactly what I needed. Highly recommended!' },
          ].map((story) => (
            <div key={story.name} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg">{story.name}</h3>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">{story.result}</span>
              </div>
              <p className="text-sm text-primary-600 mb-2">{story.exam}</p>
              <p className="text-gray-600 italic">"{story.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default ResultsPage;
