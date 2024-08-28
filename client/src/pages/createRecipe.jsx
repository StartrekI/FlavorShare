import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Input, Form, Button, Tag, message } from "antd";
import createRecipeImg from "../../public/assets/createRecipe.png";
import "../styles/createRecipe.css";
import UploadWidget from "../components/UploadWidget.jsx";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner.jsx";
import API_BASE_URL from "../constant.js";

const CreateRecipe = () => {
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser.data.data.user._id;

  const navigate = useNavigate();
  const [cookies, _] = useCookies(["access_token"]);
  const [isLoading, setIsLoading] = useState(false);

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    recipeImg: "",
    cookingTime: 0,
    userOwner: userId,
  });

  const handleChange = (field, value) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const handleIngredientChange = (value, index) => {
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    handleChange("ingredients", ingredients);
  };

  const handleAddIngredient = () => {
    handleChange("ingredients", [...recipe.ingredients, ""]);
  };

  const handleRemoveIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    handleChange("ingredients", ingredients);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const requiredFields = ["name", "instructions", "recipeImg"];
      if (requiredFields.some((field) => !recipe[field])) {
        console.error("Required fields are missing");
        message.error("Required fields are missing");
        setIsLoading(false);
        return;
      }

      // Ensure cookingTime is a number
      const recipePayload = {
        ...recipe,
        cookingTime: parseInt(recipe.cookingTime, 10) || 0,
      };

      const resp = await axios.post(
        `${API_BASE_URL}/api/v1/recipe/create`,
        recipePayload,
        {
          headers: {
            'Authorization': `Bearer ${cookies.access_token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log("Response:", resp.data);
      message.success("Recipe Created");
      navigate("/");
    } catch (error) {
      console.error('Error creating recipe:', error.response ? error.response.data : error.message);
      message.error(`Failed to create recipe: ${error.response ? error.response.data : error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageUrl) => {
    handleChange("recipeImg", imageUrl);
  };

  return (
    <>
      <Navbar />
      <div className="createRecipeContainer container">
        <p className="sectionHeading">Create Recipe</p>
        <div className="createRecipe">
          <img src={createRecipeImg} alt="Create Recipe" />
          <Form onFinish={handleSubmit} className="createRecipeForm">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input
                placeholder="Name"
                value={recipe.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea
                placeholder="Description"
                value={recipe.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Form.Item>

            <Form.Item name="ingredients">
              <div>
                {recipe.ingredients.map((ingredient, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveIngredient(index)}
                  >
                    <Input
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(e.target.value, index)
                      }
                    />
                  </Tag>
                ))}
                <Button
                  type="dashed"
                  onClick={handleAddIngredient}
                  style={{ marginTop: 8 }}
                >
                  Add Ingredient
                </Button>
              </div>
            </Form.Item>

            <Form.Item
              name="instructions"
              rules={[
                { required: true, message: "Please input the instructions!" },
              ]}
            >
              <Input.TextArea
                placeholder="Instructions"
                value={recipe.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
              />
            </Form.Item>

            <Form.Item name="recipeImg">
              <Input
                placeholder="Image URL"
                disabled
                value={recipe.recipeImg}
              />
              <UploadWidget onImageUpload={handleImageUpload} />
            </Form.Item>

            <Form.Item
              name="cookingTime"
              rules={[
                { required: true, message: "Please input the cooking time!" },
              ]}
            >
              <Input
                type="number"
                placeholder="Cooking Time (minutes)"
                value={recipe.cookingTime}
                onChange={(e) => handleChange("cookingTime", e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              {isLoading ? (
                <Button type="primary" htmlType="submit">
                  <Spinner />
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  Create Recipe
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateRecipe;
