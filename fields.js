// Shared field metadata for profile form + what-if simulator.
export const SECTIONS = [
  { title: 'Academic', fields: [
    ['tenth_pct', '10th %', 'number', { min: 0, max: 100, step: 0.1 }],
    ['twelfth_pct', '12th %', 'number', { min: 0, max: 100, step: 0.1 }],
    ['grad_pct', 'Graduation %', 'number', { min: 0, max: 100, step: 0.1 }],
    ['mca_cgpa', 'MCA CGPA', 'number', { min: 0, max: 10, step: 0.01 }],
    ['backlogs', 'Backlogs', 'number', { min: 0, max: 20 }],
    ['attendance_pct', 'Attendance %', 'number', { min: 0, max: 100, step: 0.1 }],
  ]},
  { title: 'Technical skills (1–10)', fields: [
    ['python_skill', 'Python', 'number', { min: 1, max: 10 }],
    ['java_skill', 'Java', 'number', { min: 1, max: 10 }],
    ['sql_skill', 'SQL', 'number', { min: 1, max: 10 }],
    ['dsa_skill', 'DSA', 'number', { min: 1, max: 10 }],
    ['webdev_skill', 'Web dev', 'number', { min: 1, max: 10 }],
    ['ds_skill', 'Data Science', 'number', { min: 1, max: 10 }],
    ['ml_skill', 'Machine Learning', 'number', { min: 1, max: 10 }],
  ]},
  { title: 'Career', fields: [
    ['internships_count', 'Internships', 'number', { min: 0, max: 10 }],
    ['internship_months', 'Internship months', 'number', { min: 0, max: 60 }],
    ['projects_count', 'Projects', 'number', { min: 0, max: 20 }],
    ['major_project', 'Major project (0/1)', 'number', { min: 0, max: 1 }],
    ['certifications_count', 'Certifications', 'number', { min: 0, max: 20 }],
  ]},
  { title: 'Assessments (0–100)', fields: [
    ['aptitude_score', 'Aptitude', 'number', { min: 0, max: 100 }],
    ['coding_score', 'Coding', 'number', { min: 0, max: 100 }],
    ['communication_score', 'Communication', 'number', { min: 0, max: 100 }],
    ['interview_prep_score', 'Interview prep', 'number', { min: 0, max: 100 }],
  ]},
  { title: 'Other', fields: [
    ['resume_available', 'Resume (0/1)', 'number', { min: 0, max: 1 }],
    ['github_available', 'GitHub (0/1)', 'number', { min: 0, max: 1 }],
    ['training_attended', 'Training (0/1)', 'number', { min: 0, max: 1 }],
    ['ug_stream', 'UG stream', 'select', { options: ['', 'BCA', 'BSc', 'BTech', 'BCom', 'BA'] }],
    ['specialization', 'Specialization', 'select', { options: ['', 'General', 'Data Science', 'AI'] }],
  ]},
]

export const WHATIF_FIELDS = [
  'mca_cgpa', 'dsa_skill', 'coding_score', 'communication_score',
  'internship_months', 'projects_count', 'certifications_count',
  'aptitude_score', 'python_skill', 'sql_skill',
]
