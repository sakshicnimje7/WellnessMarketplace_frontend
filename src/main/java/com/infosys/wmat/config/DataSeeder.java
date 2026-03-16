package com.infosys.wmat.config;

import com.infosys.wmat.entity.Product;
import com.infosys.wmat.entity.Question;
import com.infosys.wmat.entity.User;
import com.infosys.wmat.repository.OrderRepository; // Import OrderRepo
import com.infosys.wmat.repository.ProductRepository;
import com.infosys.wmat.repository.QuestionRepository;
import com.infosys.wmat.repository.ReviewRepository; // Import ReviewRepo
import com.infosys.wmat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@ConditionalOnProperty(name = "app.seeder.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {

    @Autowired private ProductRepository productRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ReviewRepository reviewRepository; // Add this!
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. CLEANUP (Delete Children First!)
        // We must delete reviews and orders before we can delete products/users
        reviewRepository.deleteAll();
        orderRepository.deleteAll();
        productRepository.deleteAll();
        questionRepository.deleteAll();
        // We generally don't delete users to avoid locking you out,
        // but if you want a full wipe, you'd do userRepository.deleteAll() here too.

        System.out.println("✅ Database Cleaned");

        // 2. RE-SEED
        seedProducts();
        seedCommunity();
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Bamboo Yoga Mat");
            p1.setDescription("Eco-friendly, non-slip mat for perfect stability.");
            p1.setPrice(45.99);
            p1.setCategory("Equipment");
            p1.setImageUrl("https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&w=500&q=60");

            Product p2 = new Product();
            p2.setName("Herbal Tea");
            p2.setDescription("Calming organic tea blend.");
            p2.setPrice(12.00);
            p2.setCategory("Nutrition");
            p2.setImageUrl("https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=500&q=60");

            Product p3 = new Product();
            p3.setName("Meditation Cushion");
            p3.setDescription("Ergonomic cushion for deep focus.");
            p3.setPrice(29.50);
            p3.setCategory("Comfort");
            p3.setImageUrl("https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=500&q=60");

            productRepository.saveAll(Arrays.asList(p1, p2, p3));
            System.out.println("🌱 Seeded Products!");
        }
    }

    private void seedCommunity() {
        if (questionRepository.count() == 0) {
            // Ensure we have an admin user to own the posts
            User admin = userRepository.findByEmail("admin@wmat.com")
                    .orElseGet(() -> {
                        User u = new User();
                        u.setName("Wellness Admin");
                        u.setEmail("admin@wmat.com");
                        u.setPassword(passwordEncoder.encode("admin123"));
                        u.setRole(com.infosys.wmat.entity.Role.PATIENT);
                        return userRepository.save(u);
                    });

            Question q1 = new Question();
            q1.setUser(admin);
            q1.setContent("Has anyone tried Acupuncture for migraines? Does it help?");
            q1.setCreatedAt(LocalDateTime.now().minusDays(2));

            Question q2 = new Question();
            q2.setUser(admin);
            q2.setContent("Looking for recommendations on the best herbal tea for sleep.");
            q2.setCreatedAt(LocalDateTime.now().minusHours(5));

            questionRepository.saveAll(Arrays.asList(q1, q2));
            System.out.println("🌱 Seeded Community Posts!");
        }
    }
}