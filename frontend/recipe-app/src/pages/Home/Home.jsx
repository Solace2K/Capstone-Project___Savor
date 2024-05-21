import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import RecipeCard from "../../components/Cards/RecipeCard";
import { MdAdd } from "react-icons/md";
import AddEditRecipes from "./AddEditRecipes";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddRecipeImg from "../../assets/images/addRecipe.png";
import NoDataImg from "../../assets/images/noData.png";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allRecipes, setAllRecipes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // const handleEdit goes here

  // const showToastMsg goes here

  // const handleCloseToast goes here

  // Get User Info

  // Get All Recipes

  // Delete Recipe

  // Search for a Recipe
  const onSearchRecipe = async (query) => {
    try {
        const response = await axiosInstance.get("/search-recipes", {
            params: { query }
        })

        if (response.data && response.data.recipes) {
            setIsSearch(true);
            setAllRecipes(response.data.recipes);
        }
    } catch (error) {
        console.log(error);
    }
  };

  const updateIsPinned = async (recipeData) => {
    const recipeId = recipeData._id

    try {
        const response = await axiosInstance.put("/update-recipe-pinned/" + recipeId, {
            isPinned: !recipeId.isPinned
        });

        if (response.data && response.data.recipe) {
            showToastMessage("Recipe Updated Successfully");
            getAllRecipes();
        }
    } catch (error) {
        console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllRecipes();
  };

  useEffect(() => {
    getAllRecipes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchRecipe={onSearchRecipe} 
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allRecipes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allRecipes.map((item, index) => (
              <RecipeCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                servings={item.servings}
                cuisineType={item.cuisineType}
                cookTime={item.cookTime}
                description={item.description}
                ingredients={item.ingredients}
                directions={item.directions}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteRecipe(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddRecipeImg}
            message={isSearch ? 
                `Well that didn't work... try searching again!` 
                : `Create your first recipe! Click the 'Add' button 
            to share your treat with the world. Let's get started!`}
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-purple-400 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

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
          getAllRecipes={getAllRecipes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast 
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
