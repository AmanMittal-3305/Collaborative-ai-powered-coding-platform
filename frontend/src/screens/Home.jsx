import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setProject] = useState([])

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault();
        console.log({ projectName });

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res);
                setIsModalOpen(false);
                // 👇 Add this line to update the project list
                setProject(prev => [...prev, res.data.project]);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)

        }).catch(err => {
            console.log(err)
        })

    }, [])

    return (
        <main className="p-6 bg-gray-50 min-h-screen"> {/* ✅ Smoother base */}
            <div className="projects flex flex-wrap gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="project p-4 border border-dashed border-blue-400 rounded-2xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm"
                >
                    + New Project
                </button>

                {project.map((project) => (
                    <div
                        key={project._id}
                        onClick={() => navigate(`/project`, { state: { project } })}
                        className="project flex flex-col gap-2 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl min-w-56 shadow hover:shadow-md hover:bg-slate-100 transition"
                    >
                        <h2 className="font-semibold text-lg text-slate-800">{project.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <i className="ri-user-line" />
                            <span>Collaborators:</span> {project.users.length}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">Create New Project</h2>
                        <form onSubmit={createProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Project Name
                                </label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>

    )
}

export default Home