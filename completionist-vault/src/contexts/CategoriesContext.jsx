import { createContext, useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";

const CategoriesContext = createContext(null);
const API_URL = "http://localhost:3000";

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        withCredentials: true,
      });

      setCategories(response.data);
      return response.data;
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const createCategory = useCallback(async ({ name, description }) => {
    const response = await axios.post(
      `${API_URL}/api/categories`,
      { name, description },
      { withCredentials: true },
    );

    setCategories((current) => [response.data, ...current]);
    return response.data;
  }, []);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    const response = await axios.put(
      `${API_URL}/api/categories/${categoryId}`,
      categoryData,
      { withCredentials: true },
    );

    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? response.data : category,
      ),
    );

    return response.data;
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    await axios.delete(`${API_URL}/api/categories/${categoryId}`, {
      withCredentials: true,
    });

    setCategories((current) =>
      current.filter((category) => category.id !== categoryId),
    );
  }, []);

  const addGameToCategory = useCallback(async (categoryId, game) => {
    const response = await axios.post(
      `${API_URL}/api/categories/${categoryId}/games`,
      {
        appid: game.appid,
        gameName: game.name,
      },
      { withCredentials: true },
    );

    setCategories((current) =>
      current.map((category) => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          games: [...(category.games || []), response.data],
          total_games: Number(category.total_games || 0) + 1,
        };
      }),
    );

    return response.data;
  }, []);

  const removeGameFromCategory = useCallback(async (categoryId, appid) => {
    await axios.delete(
      `${API_URL}/api/categories/${categoryId}/games/${appid}`,
      { withCredentials: true },
    );

    setCategories((current) =>
      current.map((category) => {
        if (category.id !== categoryId) return category;

        return {
          ...category,
          games: (category.games || []).filter(
            (game) => Number(game.appid) !== Number(appid),
          ),
          total_games: Math.max(Number(category.total_games || 1) - 1, 0),
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      categories,
      categoriesLoading,
      loadCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      addGameToCategory,
      removeGameFromCategory,
    }),
    [
      categories,
      categoriesLoading,
      loadCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      addGameToCategory,
      removeGameFromCategory,
    ],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories deve ser usado dentro de CategoriesProvider.");
  }

  return context;
}
