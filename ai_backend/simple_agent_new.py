def _format_website_based_response(self, search_results, website_results, all_website_data):
    """Format response based on website data when chain fails"""
    response = "**Based on our website analysis:**\n\n"
    
    # Add product information if available
    if search_results:
        response += "**Relevant Products:**\n"
        for result in search_results[:5]:
            response += f"**{result['title']}**\n"
            response += f"{result['description'][:300]}...\n"
            response += f"Category: {result['category']}\n\n"
    
    # Add relevant website content
    if website_results:
        response += "**Relevant Information from Website:**\n"
        for result in website_results:
            response += f"From {result['url']}:\n"
            response += f"{result['content']}\n\n"
    
    # Add general website content if no specific results
    if not website_results and all_website_data:
        response += "**General Website Information:**\n"
        for page in all_website_data[:3]:
            response += f"From {page['url']}:\n"
            response += f"{page['content'][:400]}...\n\n"
    
    response += "**Company Information:**\n"
    response += "- **Company Name:** Nucleus Metal Cast Private Limited\n"
    response += "- **GSTIN:** 24AAFCN3454D1ZP\n"
    response += "- **Specialization:** Shell casting, pump manufacturing, and precision industrial components\n\n"
    response += "This information is extracted directly from our website. For more details, please visit our website or contact us directly."
    
    return response
