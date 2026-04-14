from odoo import models, fields

class HeadlessPage(models.Model):
    _name = 'headless.page'
    _description = 'Headless Website Page'
    _order = 'sequence, id'

    name = fields.Char(string='Page Title', required=True)
    sequence = fields.Integer(string='Sequence', default=10)
    slug = fields.Char(string='URL Slug', required=True, copy=False, help="e.g. 'home' or 'about-us'")
    is_published = fields.Boolean(string='Published', default=True)
    section_ids = fields.One2many('headless.section', 'page_id', string='Page Sections')
    seo_title = fields.Char(string='SEO Title')
    seo_description = fields.Text(string='SEO Description')
