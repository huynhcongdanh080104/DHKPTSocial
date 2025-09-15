<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
   <xsl:template match="/">
      <html>
         <head>
            <title>Sitemap</title>
            <style>
               body { font-family: Arial, sans-serif; }
               table { width: 100%; border-collapse: collapse; }
               th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
               th { background-color: #f4f4f4; }
            </style>
         </head>
         <body>
            <h2>Sitemap</h2>
            <table>
               <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Change Frequency</th>
                  <th>Priority</th>
               </tr>
               <xsl:for-each select="//sitemap:url">
                  <tr>
                     <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                     <td><xsl:value-of select="sitemap:lastmod"/></td>
                     <td><xsl:value-of select="sitemap:changefreq"/></td>
                     <td><xsl:value-of select="sitemap:priority"/></td>
                  </tr>
               </xsl:for-each>
            </table>
         </body>
      </html>
   </xsl:template>
</xsl:stylesheet>
