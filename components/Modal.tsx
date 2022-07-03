import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext'
import TaskForm from './TaskForm'
import { KeyedMutator } from 'swr'
import { TASK } from '../types/Types'

interface PROPS {
  mutate: KeyedMutator<TASK[]>
}

const Modal: React.FC<PROPS> = ({ mutate }) => {
  const { showModal, setShowModal } = useContext(TaskContext)
  const clearModal = () => {
    mutate()
    setShowModal(false)
  }
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-2/5 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Task更新</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => clearModal()}
                  >
                    <span
                      className="bg-transparent text-black h-6 w-6 opacity-50
                     text-2xl block outline-none focus:outline-none"
                    >
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <TaskForm />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}

export default Modal
