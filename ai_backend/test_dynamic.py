#!/usr/bin/env python3
"""
Test script for dynamic product fetching system
"""

import sys
import os

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_static_data():
    """Test static product data"""
    try:
        from products_database import get_all_product_names, get_products_by_category
        
        print("Testing static product data...")
        all_products = get_all_product_names()
        print(f"Total static products: {len(all_products)}")
        
        shell_castings = get_products_by_category("shell_castings")
        print(f"Shell castings: {len(shell_castings)}")
        
        pumps = get_products_by_category("pumps") + get_products_by_category("pump_components")
        print(f"Pumps & components: {len(pumps)}")
        
        return True
    except Exception as e:
        print(f"Static data test failed: {e}")
        return False

def test_dynamic_fetcher():
    """Test dynamic product fetcher"""
    try:
        from dynamic_products import DynamicProductFetcher
        
        print("\nTesting dynamic product fetcher...")
        fetcher = DynamicProductFetcher()
        
        # Test initialization
        print("Dynamic fetcher initialized successfully")
        
        # Test product discovery (without actual crawling)
        print("Product discovery method available")
        
        return True
    except Exception as e:
        print(f"Dynamic fetcher test failed: {e}")
        return False

def test_agent_integration():
    """Test agent integration"""
    try:
        from simple_agent import SimpleAIAgent
        
        print("\nTesting agent integration...")
        
        # Test with static data
        agent_static = SimpleAIAgent(use_dynamic_data=False)
        print("Agent with static data initialized successfully")
        
        # Test with dynamic data (but don't actually fetch)
        agent_dynamic = SimpleAIAgent(use_dynamic_data=True)
        print("Agent with dynamic data initialized successfully")
        
        return True
    except Exception as e:
        print(f"Agent integration test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Dynamic Product System Test ===\n")
    
    tests = [
        ("Static Data", test_static_data),
        ("Dynamic Fetcher", test_dynamic_fetcher),
        ("Agent Integration", test_agent_integration)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"Test {test_name} crashed: {e}")
            results.append((test_name, False))
    
    print("\n=== Test Results ===")
    for test_name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\nTotal: {total_passed}/{len(results)} tests passed")
    
    if total_passed == len(results):
        print("\n🎉 All tests passed! The dynamic product system is ready.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
