"""
Comprehensive product database for Nucleus Metal Cast Private Limited
Contains specific product names across all manufacturing categories
"""

PRODUCTS_DATABASE = {
    "shell_castings": [
        "Valve Body Castings",
        "Pump Housing Castings", 
        "Impeller Castings",
        "Gear Box Castings",
        "Engine Block Castings",
        "Manifold Castings",
        "Flange Castings",
        "Bracket Castings",
        "Housing Castings",
        "Connector Castings",
        "Adapter Castings",
        "Nozzle Castings",
        "Injector Castings",
        "Turbocharger Castings",
        "Compressor Castings"
    ],
    
    "pumps": [
        "Centrifugal Pumps",
        "Submersible Pumps", 
        "Gear Pumps",
        "Piston Pumps",
        "Diaphragm Pumps",
        "Screw Pumps",
        "Peristaltic Pumps",
        "Jet Pumps",
        "Rotary Pumps",
        "Reciprocating Pumps",
        "Axial Flow Pumps",
        "Mixed Flow Pumps",
        "Vertical Turbine Pumps",
        "Horizontal Split Case Pumps",
        "Multistage Pumps"
    ],
    
    "pump_components": [
        "Pump Casing Assembly",
        "Impeller Type A - Closed",
        "Mechanical Seal Assembly", 
        "Shaft Sleeve SS 304",
        "Wear Ring Assembly",
        "Gasket Kit Complete",
        "Pump Shaft",
        "Bearing Housing",
        "Seal Chamber",
        "Suction Strainer",
        "Discharge Nozzle",
        "Lantern Ring",
        "Throttle Bushing",
        "Stuffing Box"
    ],
    
    "precision_components": [
        "Precision Gears",
        "Automotive Components",
        "Aerospace Components",
        "Medical Device Components",
        "Electrical Components",
        "Hydraulic Components",
        "Pneumatic Components",
        "Machine Tool Components",
        "Robotic Components",
        "Instrumentation Components",
        "Valve Components",
        "Fittings and Connectors",
        "Fasteners and Bolts",
        "Shafts and Axles",
        "Bushings and Bearings"
    ],
    
    "industrial_castings": [
        "Machine Tool Castings",
        "Industrial Valve Castings",
        "Marine Component Castings",
        "Construction Equipment Castings",
        "Mining Equipment Castings",
        "Agricultural Equipment Castings",
        "Power Generation Castings",
        "Oil and Gas Castings",
        "Chemical Processing Castings",
        "Food Processing Castings",
        "Pharmaceutical Equipment Castings",
        "Textile Machinery Castings",
        "Packaging Machinery Castings",
        "Material Handling Castings",
        "Conveyor System Castings"
    ]
}

def get_all_product_names():
    """Returns a flat list of all product names"""
    all_products = []
    for category, products in PRODUCTS_DATABASE.items():
        all_products.extend(products)
    return all_products

def get_products_by_category(category):
    """Returns products for a specific category"""
    return PRODUCTS_DATABASE.get(category, [])

def search_products(query):
    """Search for products by name or category"""
    query = query.lower()
    results = []
    
    for category, products in PRODUCTS_DATABASE.items():
        if query in category.lower():
            results.extend(products)
        else:
            results.extend([product for product in products if query in product.lower()])
    
    return list(set(results))  # Remove duplicates

if __name__ == "__main__":
    # Test the database
    print("All Products:", len(get_all_product_names()))
    print("Pump Components:", get_products_by_category("pump_components"))
    print("Search 'pump':", search_products("pump"))
