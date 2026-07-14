import { createContext, useCallback, useContext, useMemo, useState } from "react";
import axios from "axios";

const CategoriesContext = createContext(null);
const API_URL = "http://localhost:3000";

// O backend novo usa appId/name. A tela original usa appid/game_name.
// Esta normalização mantém os botões, o CSS e a estrutura visual existentes.
function normalizeCategory(category) {
  if (!category) return category;

  const games = (category.games || []).map((game) => ({
    ...game,
    appid: game.appid ?? game.appId,
    game_name: game.game_name ?? game.name,
  }));

  return {
    ...category,
    games,
    total_games: category.total_games ?? games.length,
  };
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/categories`, {
        withCredentials: true,
      });

      const normalized = response.data.map(normalizeCategory);
      setCategories(normalized);
      return normalized;
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

    const category = normalizeCategory(response.data);
    setCategories((current) => [category, ...current]);
    return category;
  }, []);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    const response = await axios.put(
      `${API_URL}/api/categories/${categoryId}`,
      categoryData,
      { withCredentials: true },
    );

    const updatedCategory = normalizeCategory(response.data);
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? updatedCategory : category,
      ),
    );

    return updatedCategory;
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
        appId: game.appid,
        gameName: game.name,
      },
      { withCredentials: true },
    );

    const updatedCategory = normalizeCategory(response.data);
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? updatedCategory : category,
      ),
    );

    return updatedCategory;
  }, []);

  const removeGameFromCategory = useCallback(async (categoryId, appid) => {
    const response = await axios.delete(
      `${API_URL}/api/categories/${categoryId}/games/${appid}`,
      { withCredentials: true },
    );

    const updatedCategory = normalizeCategory(response.data);
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId ? updatedCategory : category,
      ),
    );

    return updatedCategory;
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
