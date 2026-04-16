package com.luv2code.ecommerce.rest;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ModelAndView handleError(HttpServletRequest request) {
        Object status = request.getAttribute("javax.servlet.error.status_code");
        
        ModelAndView modelAndView = new ModelAndView();
        
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                // Redirect 404 errors back to home page (frontend will handle routing)
                modelAndView.setViewName("forward:/index.html");
                return modelAndView;
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                modelAndView.setViewName("forward:/index.html");
                return modelAndView;
            }
        }
        
        // Default: serve index.html (frontend SPA will handle routing)
        modelAndView.setViewName("forward:/index.html");
        return modelAndView;
    }
}
