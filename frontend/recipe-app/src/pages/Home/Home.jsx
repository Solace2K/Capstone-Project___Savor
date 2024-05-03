import React from 'react'

const Home = () => {
    return (
        <>
        

        <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {}}
            style={{
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.2)",
                },
            }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >
            <AddEditRecipes 
                type={openAddEditModal.type}
                recipeData={openAddEditModal.data}
                onClose={() => {
                    setOpenAddEditModal({ isShown: false, type: "add", data: null });
                }}
            />
        </Modal>
        </>
    )
}

export default Home