import { Link } from 'react-router-dom'

const steps = [
  ['1. Complete profile', 'Enter academics, skills, internships, projects and assessment scores.'],
  ['2. Run prediction', 'The trained model estimates placement probability with explainable factors.'],
  ['3. Analyze gaps', 'See strengths, weaknesses and personalized skill-gap recommendations.'],
  ['4. Simulate', 'Use the What-If simulator to test improvements before acting on them.'],
]

const features = [
  ['Placement estimate', 'Probability + confidence band, clearly labeled as an ML estimate.'],
  ['Explainability', 'Top factors behind each prediction — association, not causation.'],
  ['Skill-gap analysis', 'Current skill levels mapped to gaps with targeted actions.'],
  ['What-If simulator', 'Change CGPA, skills or experience and compare predicted outcomes.'],
  ['Dashboards', 'Student readiness view plus admin analytics and model comparison.'],
  ['History', 'Every prediction stored with input snapshot and model version.'],
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-lg font-bold">Placement<span className="text-indigo-600">AI</span></span>
        <div className="flex gap-2">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Login</Link>
          <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Register</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-16 text-center">
          <p className="text-sm font-semibold tracking-widest text-indigo-600">MCA DATA SCIENCE & AI PROJECT</p>
          <h1 className="mt-3 text-5xl font-extrabold">Predict. Analyze. Improve.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            An AI-powered student placement prediction and career readiness analysis system.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">Get started</Link>
            <Link to="/login" className="rounded-lg border px-6 py-3 font-semibold hover:bg-white">Login</Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">Demo logins — student: student@college.edu / Student123! · admin: admin@college.edu / Admin123!</p>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-bold">How it works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {steps.map(([t, d]) => (
              <div key={t} className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-bold">Key features</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {features.map(([t, d]) => (
              <div key={t} className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-slate-900 p-8 text-white">
          <h2 className="text-xl font-bold">ML workflow</h2>
          <p className="mt-2 text-sm text-slate-300">
            Synthetic training data (clearly labeled) → stratified split → ColumnTransformer fit on train only →
            Logistic Regression / Decision Tree / Random Forest / XGBoost compared on accuracy, precision, recall,
            F1 and ROC-AUC → best by F1 saved with joblib. Predictions are estimates, not guarantees.
          </p>
        </section>

        <footer className="py-10 text-center text-xs text-slate-500">
          Academic demo project. Model predictions are estimates based on synthetic data — not placement guarantees.
        </footer>
      </main>
    </div>
  )
}
