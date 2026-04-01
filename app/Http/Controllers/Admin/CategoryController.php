<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function categories()
    {
        $categories = Category::withCount('items')->get();
        return Inertia::render('Officer/Categories', [
            'categories' => $categories,
        ]);
    }

    public function createCategory()
    {
        return Inertia::render('Officer/CategoryForm');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);

        Category::create($validated);
        return redirect()->route('officer.categories')->with('success', 'Category created.');
    }

    public function editCategory(Category $category)
    {
        return Inertia::render('Officer/CategoryForm', [
            'category' => $category,
        ]);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validated);
        return redirect()->route('officer.categories')->with('success', 'Category updated.');
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return redirect()->route('officer.categories')->with('success', 'Category deleted.');
    }
}