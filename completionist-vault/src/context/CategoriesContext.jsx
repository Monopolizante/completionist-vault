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

  const createCategory = useCallback(async (category) => {
    const response = await axios.post(`${API_URL}/api/categories`, category, {
      withCredentials: true,
    });
    setCategories((current) => [...current, response.data]);
    return response.data;
  }, []);

  const updateCategory = useCallback(async (categoryId, category) => {
    const response = await axios.put(
      `${API_URL}/api/categories/${categoryId}`,
      category,
      { withCredentials: true },
    );
    setCategories((current) =>
      current.map((item) => (item.id === categoryId ? response.data : item)),
    );
    return response.data;
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    await axios.delete(`${API_URL}/api/categories/${categoryId}`, {
      withCredentials: true,
    });
    setCategories((current) => current.filter((item) => item.id !== categoryId));
  }, []);

  const addGameToCategory = useCallback(async (categoryId, game) => {
    const response = await axios.post(
      `${API_URL}/api/categories/${categoryId}/games`,
      { appId: game.appid, gameName: game.name },
      { withCredentials: true },
    );
    setCategories((current) =>
      current.map((item) => (item.id === categoryId ? response.data : item)),
    );
  }, []);

  const removeGameFromCategory = useCallback(async (categoryId, appId) => {
    const response = await axios.delete(
      `${API_URL}/api/categories/${categoryId}/games/${appId}`,
      { withCredentials: true },
    );
    setCategories((current) =>
      current.map((item) => (item.id === categoryId ? response.data : item)),
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

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories deve ser usado dentro de CategoriesProvider");
  }
  return context;
}
